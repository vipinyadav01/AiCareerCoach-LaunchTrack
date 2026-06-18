"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#070D0D] to-[#1a1a1a] p-4">
      <Card className="w-full max-w-md text-center border-2 border-[#EFEDE4]/20">
        <CardHeader>
          <div className="mx-auto mb-4 p-3 rounded-full bg-[#EFEDE4]/10">
            <WifiOff className="h-8 w-8 text-[#EFEDE4]" />
          </div>
          <CardTitle className="text-[#EFEDE4] text-2xl">You're Offline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[#EFEDE4]/80">
            It looks like you're not connected to the internet. Some features may not be available.
          </p>
          <p className="text-sm text-[#EFEDE4]/60">
            Don't worry! You can still access some of your saved data and previously viewed content.
          </p>
          <Button 
            onClick={handleRefresh}
            className="w-full bg-[#EFEDE4] text-[#070D0D] hover:bg-[#EFEDE4]/90"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
