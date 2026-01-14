"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";

export default function GeminiDiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDiagnostics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/diagnostics/gemini");
      const data = await response.json();
      setDiagnostics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "ok":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Loader2 className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ok":
        return <Badge className="bg-emerald-500">OK</Badge>;
      case "error":
        return <Badge className="bg-red-500">Error</Badge>;
      case "warning":
        return <Badge className="bg-amber-500">Warning</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Running diagnostics...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-500" />
              Error
            </CardTitle>
            <CardDescription>Failed to fetch diagnostics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchDiagnostics} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gemini AI Diagnostics</h1>
          <p className="text-muted-foreground mt-2">
            Check the status and configuration of Gemini AI integration
          </p>
        </div>
        <Button onClick={fetchDiagnostics} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(diagnostics?.status)}
            Overall Status
          </CardTitle>
          <CardDescription>
            Last checked: {diagnostics?.timestamp ? new Date(diagnostics.timestamp).toLocaleString() : "N/A"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            {getStatusBadge(diagnostics?.status)}
            {diagnostics?.errors?.length > 0 && (
              <span className="text-red-500">
                {diagnostics.errors.length} error(s)
              </span>
            )}
            {diagnostics?.warnings?.length > 0 && (
              <span className="text-amber-500">
                {diagnostics.warnings.length} warning(s)
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Individual Checks */}
      {diagnostics?.checks && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Diagnostic Checks</h2>
          {Object.entries(diagnostics.checks).map(([key, check]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(check.status)}
                    {getStatusBadge(check.status)}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {check.message && (
                  <p className="text-sm text-muted-foreground">{check.message}</p>
                )}
                {check.error && (
                  <div className="bg-red-50 dark:bg-red-950 p-3 rounded-md">
                    <p className="text-sm text-red-700 dark:text-red-300 font-mono">
                      {check.error}
                    </p>
                  </div>
                )}
                {check.responsePreview && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-xs font-mono text-muted-foreground">
                      Response preview: {check.responsePreview}
                    </p>
                  </div>
                )}
                {check.duration && (
                  <p className="text-xs text-muted-foreground">
                    Duration: {check.duration}
                  </p>
                )}
                {check.length && (
                  <p className="text-xs text-muted-foreground">
                    Length: {check.length}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Errors */}
      {diagnostics?.errors && diagnostics.errors.length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <XCircle className="h-5 w-5" />
              Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {diagnostics.errors.map((error, index) => (
                <li key={index} className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {diagnostics?.warnings && diagnostics.warnings.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {diagnostics.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-amber-600 dark:text-amber-400">
                  {warning}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Raw JSON (for debugging) */}
      <Card>
        <CardHeader>
          <CardTitle>Raw Diagnostic Data</CardTitle>
          <CardDescription>Full diagnostic response for debugging</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
            {JSON.stringify(diagnostics, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
