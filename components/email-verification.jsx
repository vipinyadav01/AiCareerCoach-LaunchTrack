"use client";

import { useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Mail, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export function EmailVerification({ email, onVerified, onCancel }) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await authClient.emailOtp.verifyEmail({
        email,
        otp: code,
      });

      if (error) throw error;

      // Check if auto-sign-in is enabled (default behavior)
      if (data?.session) {
        setMessage('Email verified! Signing you in...');
        // Session is created, user is signed in
        setTimeout(() => {
          onVerified?.(data.session);
        }, 1000);
      } else {
        setMessage('Email verified! You can now sign in.');
        setTimeout(() => {
          onVerified?.(null);
        }, 2000);
      }
    } catch (error) {
      setMessage(error?.message || 'Invalid verification code. Please try again.');
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setMessage('');

    try {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: typeof window !== 'undefined' ? window.location.origin + '/' : '/',
      });

      if (error) throw error;
      setMessage('Verification email sent! Check your inbox.');
    } catch (error) {
      setMessage(error?.message || 'Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <CardTitle>Verify Your Email</CardTitle>
        </div>
        <CardDescription>
          Enter the verification code sent to <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              className="text-center text-2xl tracking-widest font-mono"
              disabled={isLoading}
            />
          </div>

          {message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg text-sm ${message.includes('error') || message.includes('Invalid') || message.includes('Failed')
                  ? 'bg-destructive/10 text-destructive border border-destructive/20'
                  : 'bg-primary/10 text-primary border border-primary/20'
                }`}
            >
              {message.includes('error') || message.includes('Invalid') || message.includes('Failed') ? (
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isLoading || code.length !== 6} className="w-full">
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-primary hover:underline disabled:opacity-50 flex items-center gap-1"
              >
                <RefreshCw className={`h-3 w-3 ${isResending ? 'animate-spin' : ''}`} />
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Verification codes expire after 15 minutes
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
