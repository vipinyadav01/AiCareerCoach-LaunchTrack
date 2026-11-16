"use client";

import { useEffect, useState } from "react";
import { EmptyState, PageHeader, Panel, Screen, Skeleton } from "@/components/app/screen";
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

  const STATUS = {
    ok: { label: "Passing", icon: CheckCircle2, className: "text-success" },
    error: { label: "Failing", icon: XCircle, className: "text-destructive" },
    warning: { label: "Warning", icon: AlertTriangle, className: "text-warning" },
  };

  const StatusLabel = ({ status }) => {
    const s = STATUS[status] || { label: "Unknown", icon: Loader2, className: "text-muted-foreground" };
    const Icon = s.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${s.className}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
        {s.label}
      </span>
    );
  };

  const refreshButton = (
    <Button onClick={fetchDiagnostics} variant="outline" disabled={loading}>
      <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
      {loading ? "Running" : "Run again"}
    </Button>
  );

  const header = (
    <PageHeader
      title="Gemini diagnostics"
      description="Checks the API key, model access and a live test request."
      meta={
        diagnostics?.timestamp ? `Last run ${new Date(diagnostics.timestamp).toLocaleString()}` : null
      }
      actions={refreshButton}
    />
  );

  if (loading && !diagnostics) {
    return (
      <Screen>
        {header}
        <div className="space-y-3" role="status" aria-live="polite">
          <span className="sr-only">Running diagnostics</span>
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        {header}
        <EmptyState
          title="The diagnostics request failed"
          description={error}
          action={refreshButton}
        />
      </Screen>
    );
  }

  const checks = Object.entries(diagnostics?.checks || {});
  const errors = diagnostics?.errors || [];
  const warnings = diagnostics?.warnings || [];

  return (
    <Screen>
      {header}

      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border bg-card px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Overall</span>
          <StatusLabel status={diagnostics?.status} />
        </div>
        <span className="tabular text-sm text-muted-foreground">
          {errors.length} {errors.length === 1 ? "error" : "errors"}, {warnings.length}{" "}
          {warnings.length === 1 ? "warning" : "warnings"}
        </span>
      </div>

      {checks.length > 0 && (
        <Panel title="Checks" bodyClassName="p-0">
          <ul className="divide-y">
            {checks.map(([key, check]) => (
              <li key={key} className="space-y-2 px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                  <StatusLabel status={check.status} />
                </div>
                {check.message && <p className="text-sm text-muted-foreground">{check.message}</p>}
                {check.error && (
                  <p className="rounded-md bg-destructive/5 px-3 py-2 font-mono text-sm text-destructive [overflow-wrap:anywhere]">
                    {check.error}
                  </p>
                )}
                {check.responsePreview && (
                  <p className="rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground [overflow-wrap:anywhere]">
                    {check.responsePreview}
                  </p>
                )}
                {(check.duration || check.length) && (
                  <p className="tabular text-sm text-muted-foreground">
                    {check.duration && <>Took {check.duration}</>}
                    {check.duration && check.length && <>, </>}
                    {check.length && <>{check.length} characters</>}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {(errors.length > 0 || warnings.length > 0) && (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {errors.length > 0 && (
            <Panel title="Errors">
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-destructive">
                {errors.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </Panel>
          )}
          {warnings.length > 0 && (
            <Panel title="Warnings">
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-warning">
                {warnings.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      )}

      <details className="group mt-6 rounded-xl border bg-card">
        <summary className="cursor-pointer list-none rounded-xl px-5 py-4 font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring">
          Raw response
        </summary>
        <pre className="overflow-auto border-t bg-muted px-5 py-4 font-mono text-xs leading-relaxed">
          {JSON.stringify(diagnostics, null, 2)}
        </pre>
      </details>
    </Screen>
  );
}
