import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const name = `${user.firstName} ${user.lastName}`;
    const email = user.emailAddresses[0].emailAddress;

    // First, check if user exists by clerkUserId
    let loggedInUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) {
      // Update user info if they already exist
      loggedInUser = await db.user.update({
        where: { id: loggedInUser.id },
        data: {
          name,
          imageUrl: user.imageUrl,
          email,
        },
      });
      return loggedInUser;
    }

    // Check if user exists by email (in case they have different clerkUserId)
    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      // Update the clerkUserId for existing user
      loggedInUser = await db.user.update({
        where: { id: existingUserByEmail.id },
        data: {
          clerkUserId: user.id,
          name,
          imageUrl: user.imageUrl,
        },
      });
      return loggedInUser;
    }

    // Create new user if they don't exist
    loggedInUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email,
      },
    });

    return loggedInUser;
  } catch (error) {
    // Return a temporary user object to allow the app to function
    // even if database is unreachable
    return {
      clerkUserId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
      industry: null, // Will need to complete onboarding
      isTemporary: true, // Flag to indicate this is not from DB
    };
  }
};