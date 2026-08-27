import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Namespace-style call-to-action button: square-ish corners (2px), 15px medium
 * label, and an arrow-up-right that nudges on hover. Renders as a next/link.
 */
const variants = {
  primary: "bg-[#1c32ff] text-white hover:bg-[#1428d6]",
  white: "bg-white text-[#1c32ff] hover:bg-[#f0f3ff]",
  outlineWhite: "border border-white/70 text-white hover:bg-white/10",
  outlineInk: "border border-black/15 text-[#0b0b12] hover:bg-black/[0.04]",
  ghost: "text-[#0b0b12] hover:bg-black/[0.05]",
  link: "!px-0 !py-0 text-[#1c32ff] hover:text-[#1428d6]",
};

export function NsButton({
  href = "#",
  children,
  variant = "primary",
  arrow = true,
  external = false,
  className,
  ...props
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group inline-flex items-center justify-center rounded-sm px-6 py-2.5 text-[15px] font-medium transition-all",
        variants[variant],
        className
      )}
      {...props}
    >
      <span className="whitespace-nowrap">{children}</span>
      {arrow && (
        <ArrowUpRight
          className="ml-1.5 h-[18px] w-[18px] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}
