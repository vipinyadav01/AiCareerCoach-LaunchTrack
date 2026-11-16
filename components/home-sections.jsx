// Homepage sections that explain the product and show it. Server components:
// no client JS, same container, borders and type as the rest of the landing page.

const steps = [
  {
    n: "01",
    title: "Set up your profile",
    body: "Industry, specialization, years of experience and skills. It takes about two minutes and you only do it once.",
  },
  {
    n: "02",
    title: "Read your market",
    body: "Your dashboard shows salary ranges by role, demand, growth and the skills employers in your field ask for.",
  },
  {
    n: "03",
    title: "Act on it",
    body: "Close skill gaps with goals, tailor your resume and cover letters, and practise interviews until the scores climb.",
  },
];

export function HowItWorks() {
  return (
    <ol className="grid grid-cols-1 gap-[2px] overflow-hidden rounded-[4px] border border-black/10 bg-black/10 md:grid-cols-3">
      {steps.map((step) => (
        <li key={step.n} className="flex flex-col gap-10 bg-white p-7 sm:p-8">
          <span className="font-heading text-[40px] font-medium leading-none tracking-[-0.02em] text-primary">{step.n}</span>
          <div className="space-y-2">
            <h3 className="font-heading text-[20px] font-medium leading-[1.2] tracking-[-0.01em] text-foreground">
              {step.title}
            </h3>
            <p className="text-[15px] leading-[1.55] text-muted-foreground">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

// Sample rows for the preview only. Labelled as sample data on the page.
const sampleRoles = [
  { role: "Frontend Engineer", min: 600, median: 1100, max: 2200 },
  { role: "Backend Engineer", min: 700, median: 1300, max: 2600 },
  { role: "Engineering Manager", min: 2400, median: 3600, max: 5400 },
];
const sampleGaps = ["Kubernetes", "System design", "LLM integration"];
const sampleHave = ["React", "TypeScript", "SQL"];

const fmt = (v) => `${v.toLocaleString("en-US")}k`;

export function ProductPreview() {
  const floor = Math.min(...sampleRoles.map((r) => r.min));
  const span = Math.max(...sampleRoles.map((r) => r.max)) - floor;
  const pct = (v) => ((v - floor) / span) * 100;

  return (
    <figure className="overflow-hidden rounded-[4px] border border-black/10 bg-muted">
      <div className="grid grid-cols-1 gap-[2px] bg-black/10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="min-w-0 bg-white p-6 sm:p-8">
          <p className="text-[15px] font-medium text-foreground">Salary range by role</p>
          <p className="mt-1 text-[14px] text-muted-foreground">Bar from minimum to maximum, mark at the median</p>
          <ul className="mt-8 space-y-6">
            {sampleRoles.map((r) => (
              <li key={r.role} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2.5 sm:grid-cols-[10rem_minmax(0,1fr)_auto]">
                <span className="text-[14px] font-medium text-foreground">{r.role}</span>
                <span className="tabular order-last col-span-2 sm:order-none sm:col-span-1">
                  <span className="relative block h-2 rounded-full bg-muted" aria-hidden="true">
                    <span
                      className="absolute inset-y-0 rounded-full bg-primary/25"
                      style={{ left: `${pct(r.min)}%`, right: `${100 - pct(r.max)}%` }}
                    />
                    <span
                      className="absolute -top-1 h-4 w-[3px] -translate-x-1/2 rounded-full bg-primary"
                      style={{ left: `${pct(r.median)}%` }}
                    />
                  </span>
                </span>
                <span className="tabular text-right text-[14px] text-muted-foreground">
                  <span className="text-foreground">{fmt(r.median)}</span> median
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 bg-white p-6 sm:p-8">
          <p className="text-[15px] font-medium text-foreground">Your skills against the market</p>
          <p className="mt-6 text-[14px] text-muted-foreground">Gaps to close</p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {sampleGaps.map((s) => (
              <li key={s} className="rounded-[4px] border border-primary/30 bg-accent px-2.5 py-1 text-[14px] text-accent-foreground">
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[14px] text-muted-foreground">You already have</p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {sampleHave.map((s) => (
              <li key={s} className="rounded-[4px] border border-black/10 px-2.5 py-1 text-[14px] text-foreground">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="border-t border-black/10 bg-white px-6 py-3 text-[13px] text-muted-foreground sm:px-8">
        Sample data. Your dashboard uses your own industry and skills.
      </figcaption>
    </figure>
  );
}
