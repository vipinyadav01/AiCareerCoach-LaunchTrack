import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Shared building blocks for the signed-in app screens.
 * One container width, one panel recipe, one type scale, so every
 * screen reads as the same tool.
 */

export function Screen({ className, children }) {
  return (
    <div className={cn("w-full px-4 pt-8 pb-24 sm:px-6 lg:px-10", className)}>
      {children}
    </div>
  );
}

export function BackLink({ href, children }) {
  return (
    <Link
      href={href}
      className="-ml-1.5 mb-4 inline-flex h-8 items-center gap-1 rounded-md px-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      {children}
    </Link>
  );
}

export function PageHeader({ title, description, actions, meta, className }) {
  return (
    <header
      className={cn(
        "mb-8 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-1.5">
        <h1 className="text-[28px] leading-[1.15] tracking-[-0.02em] text-foreground [overflow-wrap:break-word] sm:text-[32px]">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{description}</p>
        )}
        {meta && <div className="pt-1 text-sm text-muted-foreground">{meta}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Panel({ title, description, actions, className, bodyClassName, children, as: Tag = "section" }) {
  return (
    <Tag className={cn("min-w-0 rounded-xl border bg-card", className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4">
          <div className="min-w-0 space-y-0.5">
            {title && <h2 className="text-base font-medium tracking-[-0.01em]">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </Tag>
  );
}

/* A row of figures divided by hairlines: one surface, not a grid of cards. */
export function StatStrip({ children, className }) {
  return (
    <dl
      className={cn(
        "grid grid-cols-1 divide-y rounded-xl border bg-card sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))] sm:divide-x sm:divide-y-0",
        className
      )}
    >
      {children}
    </dl>
  );
}

export function Stat({ label, value, note, tone }) {
  const toneClass =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : tone === "danger" ? "text-destructive" : "text-foreground";
  return (
    <div className="min-w-0 px-5 py-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className={cn("tabular mt-1 text-2xl font-medium tracking-[-0.02em]", toneClass)}>{value}</dd>
      {note && <dd className="mt-0.5 text-sm text-muted-foreground">{note}</dd>}
    </div>
  );
}

export function EmptyState({ title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-start gap-3 rounded-xl border border-dashed px-6 py-10", className)}>
      <div className="space-y-1">
        <p className="text-base font-medium">{title}</p>
        {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function FieldError({ error }) {
  if (!error?.message) return null;
  return (
    <p role="alert" className="text-sm text-destructive">
      {error.message}
    </p>
  );
}

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-md bg-muted motion-reduce:animate-none", className)} aria-hidden="true" />;
}
