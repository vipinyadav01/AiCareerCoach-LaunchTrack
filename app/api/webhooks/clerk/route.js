import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { db, executeWithRetry } from '@/lib/prisma';
import { triggerNewUserOnboarding } from '@/lib/inngest/events';

export async function POST(req) {
  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  let evt;

  // Verify the webhook signature (security critical)
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Webhook signature verification failed:', {
      error: err.message,
      timestamp: new Date().toISOString(),
    });
    return new Response('Invalid webhook signature', {
      status: 401,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  const { id, email_addresses, first_name, last_name, image_url, username } = evt.data;

  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const email = email_addresses?.[0]?.email_address || email_addresses?.[0]?.emailAddress;
      const name = `${first_name || ''} ${last_name || ''}`.trim() || username || 'User';

      if (!email) {
        console.warn('Webhook: User has no email address');
        return new Response('User has no email', { status: 400 });
      }

      // Sync user to Prisma database
      const startTime = Date.now();
      const syncedUser = await executeWithRetry(async () => {
        return await db.user.upsert({
          where: { clerkUserId: id },
          update: {
            name,
            email,
            imageUrl: image_url || null,
          },
          create: {
            clerkUserId: id,
            name,
            email,
            imageUrl: image_url || null,
            skills: [],
          },
        });
      });

      const duration = Date.now() - startTime;
      console.log(`✅ Webhook: User ${eventType === 'user.created' ? 'created' : 'updated'}`, {
        clerkUserId: id,
        email,
        duration: `${duration}ms`,
      });

      // Trigger Inngest event for new user onboarding
      if (eventType === 'user.created') {
        try {
          await triggerNewUserOnboarding({
            id,
            email,
            name,
          });
          console.log(`✅ Inngest: Triggered onboarding`, {
            clerkUserId: id,
            email,
          });
        } catch (inngestError) {
          console.error('Error triggering Inngest event', {
            clerkUserId: id,
            error: inngestError.message,
          });
          // Don't fail the webhook if Inngest fails
        }
      }
    } else if (eventType === 'user.deleted') {
      // Handle user deletion
      await executeWithRetry(async () => {
        return await db.user.delete({
          where: { clerkUserId: id },
        });
      });

      console.log('✅ Webhook: User deleted', {
        clerkUserId: id,
      });
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook', {
      error: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
    return new Response('Error processing webhook', { status: 500 });
  }
}
