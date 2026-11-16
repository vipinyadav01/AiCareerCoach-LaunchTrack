"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import { ChevronRight, FileSignature, FileText, Flag, MessagesSquare, Pencil, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { createGoal } from "@/actions/goals";
import { useNeonUser } from "@/hooks/use-neon-auth";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, Panel, Screen, Stat, StatStrip } from "@/components/app/screen";

const toneFor = (value) => {
  const v = String(value || "").toLowerCase();
  if (v === "positive" || v === "high") return "success";
  if (v === "negative" || v === "low") return "danger";
  if (v === "neutral" || v === "medium") return "warning";
  return undefined;
};

const formatIndustry = (industry) =>
  String(industry || "Your industry")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const sentence = (value) => {
  const s = String(value || "");
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const formatK =(value) => `${Math.round(value).toLocaleString("en-US")}k`;

const NEXT_STEPS = [
  { href: "/resume", icon: FileText, title: "Resume", note: "Edit and export your ATS-ready resume" },
  { href: "/ai-cover-letter", icon: FileSignature, title: "Cover letters", note: "Write a letter for a specific job" },
  { href: "/interview", icon: MessagesSquare, title: "Interview practice", note: "Take a quiz built from your skills" },
  { href: "/goals", icon: Flag, title: "Goals", note: "Track milestones and certifications" },
];

// Loose match so "React.js", "react" and "React JS" count as the same skill.
const skillKey = (s) => String(s).toLowerCase().replace(/[^a-z0-9+#]/g, "").replace(/js$/, "");

function splitSkills(userSkills, marketSkills) {
  const mine = new Set(userSkills.map(skillKey));
  const seen = new Set();
  const market = marketSkills.filter((s) => {
    const k = skillKey(s);
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return { have: market.filter((s) => mine.has(skillKey(s))), gaps: market.filter((s) => !mine.has(skillKey(s))) };
}

function SalaryLedger({ rows }) {
  if (!rows.length) {
    return (
      <EmptyState
        className="border-0 px-0 py-6"
        title="No salary data yet"
        description="Salary ranges appear here after the next insights refresh for your industry."
      />
    );
  }

  const floor = Math.min(...rows.map((r) => r.min));
  const ceiling = Math.max(...rows.map((r) => r.max));
  const span = Math.max(ceiling - floor, 1);
  const pct = (v) => ((v - floor) / span) * 100;

  return (
    <div className="-mx-5 overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="sr-only">Salary range by role, in thousands</caption>
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th scope="col" className="px-5 pb-3 font-normal">Role</th>
            <th scope="col" className="w-[44%] px-3 pb-3 font-normal">
              <span className="flex justify-between">
                <span className="tabular">{formatK(floor)}</span>
                <span className="tabular">{formatK(ceiling)}</span>
              </span>
            </th>
            <th scope="col" className="px-3 pb-3 text-right font-normal">Min</th>
            <th scope="col" className="px-3 pb-3 text-right font-normal">Median</th>
            <th scope="col" className="px-5 pb-3 text-right font-normal">Max</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b last:border-b-0">
              <th scope="row" className="px-5 py-3.5 text-left font-medium">{row.name}</th>
              <td className="px-3 py-3.5">
                <div className="relative h-2 rounded-full bg-muted" aria-hidden="true">
                  <div
                    className="absolute inset-y-0 rounded-full bg-primary/25"
                    style={{ left: `${pct(row.min)}%`, right: `${100 - pct(row.max)}%` }}
                  />
                  <div
                    className="absolute -top-1 h-4 w-[3px] -translate-x-1/2 rounded-full bg-primary"
                    style={{ left: `${pct(row.median)}%` }}
                  />
                </div>
              </td>
              <td className="tabular px-3 py-3.5 text-right text-muted-foreground">{formatK(row.min)}</td>
              <td className="tabular px-3 py-3.5 text-right font-medium">{formatK(row.median)}</td>
              <td className="tabular px-5 py-3.5 text-right text-muted-foreground">{formatK(row.max)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SkillChips({ skills }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <li key={skill} className="rounded-md border bg-background px-2.5 py-1 text-sm">
          {skill}
        </li>
      ))}
    </ul>
  );
}

function GapChip({ skill }) {
  const [state, setState] = useState("idle");
  const add = async () => {
    setState("saving");
    try {
      await createGoal({ title: `Learn ${skill}`, kind: "goal" });
      setState("added");
      toast.success(`Added "Learn ${skill}" to your goals`);
    } catch (error) {
      setState("idle");
      toast.error(error.message || "Could not add goal");
    }
  };
  return (
    <li className="inline-flex items-center gap-1 rounded-md border bg-background py-0.5 pl-2.5 pr-0.5 text-sm">
      {skill}
      <button
        type="button"
        onClick={add}
        disabled={state !== "idle"}
        aria-label={`Add learning ${skill} to your goals`}
        className="inline-flex h-7 min-w-7 items-center justify-center rounded px-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:text-success focus-visible:outline-2 focus-visible:outline-ring"
      >
        {state === "added" ? "Added" : <Plus className="h-3.5 w-3.5" aria-hidden="true" />}
      </button>
    </li>
  );
}

function SkillGap({ userSkills, marketSkills }) {
  if (!marketSkills.length) return <p className="text-sm text-muted-foreground">No skill data for your industry yet.</p>;
  if (!userSkills.length) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Add your skills to your profile to see which of these you already cover.</p>
        <SkillChips skills={marketSkills} />
      </div>
    );
  }
  const { have, gaps } = splitSkills(userSkills, marketSkills);
  return (
    <div className="space-y-6">
      <div className="space-y-2.5">
        <h3 className="text-sm text-muted-foreground">
          Gaps to close <span className="tabular">({gaps.length})</span>
        </h3>
        {gaps.length ? (
          <ul className="flex flex-wrap gap-2">
            {gaps.map((s) => (
              <GapChip key={s} skill={s} />
            ))}
          </ul>
        ) : (
          <p className="text-sm">You list every skill your market is asking for.</p>
        )}
        {gaps.length > 0 && <p className="text-sm text-muted-foreground">Press + to turn a gap into a goal.</p>}
      </div>
      <div className="space-y-2.5">
        <h3 className="text-sm text-muted-foreground">
          You already have <span className="tabular">({have.length})</span>
        </h3>
        {have.length ? <SkillChips skills={have} /> : <p className="text-sm text-muted-foreground">None of the listed skills yet.</p>}
      </div>
    </div>
  );
}

const DashboardView = ({ insights, userSkills = [] }) => {
  const { user } = useNeonUser();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState("");
  const [nextUpdateLabel, setNextUpdateLabel] = useState("");

  const lastUpdated = insights?.lastUpdated || null;
  const nextUpdate = insights?.nextUpdate || null;

  // Dates are formatted after mount so server and client markup match.
  useEffect(() => {
    if (lastUpdated) setLastUpdatedLabel(format(new Date(lastUpdated), "d MMM yyyy"));
    if (nextUpdate) setNextUpdateLabel(formatDistanceToNow(new Date(nextUpdate), { addSuffix: true }));
  }, [lastUpdated, nextUpdate]);

  if (!insights) {
    return (
      <Screen>
        <EmptyState
          title="Insights could not be loaded"
          description="Something went wrong while fetching your industry data. Reload to try again."
          action={
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Reload
            </Button>
          }
        />
      </Screen>
    );
  }

  const data = {
    industry: insights.industry || "Unknown",
    salaryRanges: Array.isArray(insights.salaryRanges) ? insights.salaryRanges : [],
    growthRate: typeof insights.growthRate === "number" ? insights.growthRate : 0,
    demandLevel: insights.demandLevel || "Medium",
    topSkills: Array.isArray(insights.topSkills) ? insights.topSkills : [],
    marketOutlook: insights.marketOutlook || "Neutral",
    keyTrends: Array.isArray(insights.keyTrends) ? insights.keyTrends : [],
    recommendedSkills: Array.isArray(insights.recommendedSkills) ? insights.recommendedSkills : [],
  };

  const salaryRows = data.salaryRanges.map((range) => ({
    name: range.role || "Unknown role",
    min: (range.min || 0) / 1000,
    max: (range.max || 0) / 1000,
    median: (range.median || 0) / 1000,
  }));

  const firstName = user?.name?.split(" ")[0] || user?.email?.split("@")[0];
  const growth = data.growthRate;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Screen>
      <PageHeader
        title={`${formatIndustry(data.industry)} market`}
        description={firstName ? `Welcome back, ${firstName}. Here is where your field stands this week.` : "Here is where your field stands this week."}
        meta={lastUpdatedLabel ? `Updated ${lastUpdatedLabel}` : null}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/onboarding">
                <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                Edit profile
              </Link>
            </Button>
            <Button variant="ghost" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden="true" />
              {isRefreshing ? "Refreshing" : "Refresh"}
            </Button>
          </>
        }
      />

      <StatStrip>
        <Stat label="Market outlook" value={sentence(data.marketOutlook)} tone={toneFor(data.marketOutlook)} />
        <Stat
          label="Industry growth"
          value={`${growth > 0 ? "+" : ""}${growth.toFixed(1)}%`}
          note="Year over year"
          tone={growth > 0 ? "success" : growth < 0 ? "danger" : undefined}
        />
        <Stat label="Demand" value={sentence(data.demandLevel)} tone={toneFor(data.demandLevel)} />
        <Stat label="Next refresh" value={nextUpdateLabel || "Scheduled"} />
      </StatStrip>

      <Panel
        className="mt-6"
        title="Salary range by role"
        description="Annual pay in thousands. The bar spans minimum to maximum; the mark is the median."
      >
        <SalaryLedger rows={salaryRows} />
      </Panel>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Panel title="What is shaping the market">
          {data.keyTrends.length ? (
            <ol className="space-y-4">
              {data.keyTrends.map((trend, index) => (
                <li key={index} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 text-[15px] leading-relaxed">
                  <span className="tabular text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <span>{trend}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">No trends reported yet.</p>
          )}
        </Panel>

        <Panel title="Your skills against the market" description="Compared with what employers in your industry ask for.">
          <SkillGap userSkills={userSkills} marketSkills={[...data.topSkills, ...data.recommendedSkills]} />
        </Panel>
      </div>

      <nav aria-label="Career tools" className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {NEXT_STEPS.map(({ href, icon: Icon, title, note }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 bg-card px-5 py-4 transition-colors hover:bg-muted active:bg-accent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
          >
            <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{title}</span>
              <span className="block text-sm text-muted-foreground">{note}</span>
            </span>
            <ChevronRight
              className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </Link>
        ))}
      </nav>
    </Screen>
  );
};

export default DashboardView;
