"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatabaseZap, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DatabaseError({ message, onRetry }) {
  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md text-center border-2 border-border">
        <CardHeader>
          <div className="mx-auto mb-4 p-3 rounded-full bg-destructive/10">
            <DatabaseZap className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-foreground text-2xl flex items-center justify-center gap-2">
            <AlertCircle className="h-6 w-6" />
            Database Connection Issue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {message || "We're having trouble connecting to the database. This might be due to network issues or maintenance."}
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground/80">
              <strong>What you can try:</strong>
            </p>
            <ul className="text-sm text-muted-foreground/80 text-left space-y-1">
              <li>• Check your internet connection</li>
              <li>• Disable VPN or firewall temporarily</li>
              <li>• Try a different network</li>
              <li>• Contact support if the issue persists</li>
            </ul>
          </div>
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={onRetry || handleRefresh}
              className="bg-primary hover:bg-primary/90"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
