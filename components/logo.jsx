import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Launch Track brand mark — a rounded blue tile with an ascending "track"
 * (rising bars = career growth), plus the wordmark. `tone` switches the
 * wordmark color for dark surfaces (e.g. the footer).
 */
export function LogoMark({ size = 28, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#1C32FF" />
      <rect x="8" y="18" width="3.6" height="6.5" rx="1.2" fill="white" />
      <rect x="14.2" y="13" width="3.6" height="11.5" rx="1.2" fill="white" />
      <rect x="20.4" y="8" width="3.6" height="16.5" rx="1.2" fill="white" />
    </svg>
  );
}

export function Logo({ href = "/", tone = "ink", size = 28, showWord = true, className }) {
  const word =
    tone === "light" ? "text-white" : "text-[#0b0b12]";
  return (
    <Link href={href} className={cn("flex shrink-0 items-center gap-2.5", className)} aria-label="Launch Track home">
      <LogoMark size={size} />
      {showWord && (
        <span className={cn("font-heading text-[17px] font-semibold tracking-[-0.02em]", word)}>
          LaunchTrack
        </span>
      )}
    </Link>
  );
}
