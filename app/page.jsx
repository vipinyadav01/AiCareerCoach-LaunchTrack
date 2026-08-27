import dynamic from "next/dynamic";
import { memo } from "react";
import { Quote } from "lucide-react";
import { NsButton } from "@/components/ui/ns-button";
import { testimonials } from "@/data/testimonials";
import { faqs } from "../data/faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Lazy load heavy, below-the-fold pieces
const HeroSection = dynamic(() => import("@/components/hero"), {
  loading: () => <div className="mx-4 h-[520px] rounded-[16px] bg-[#1c32ff] sm:h-[620px] lg:h-[700px]" />,
  ssr: true,
});

const FeatureSection = dynamic(
  () => import("@/components/feature").then((mod) => ({ default: mod.FeatureSection })),
  { loading: () => <div className="h-96 rounded-[4px] border border-black/10" /> }
);

const stats = [
  { value: "95%", label: "Land a job within 6 months" },
  { value: "50,000+", label: "Professionals in the community" },
  { value: "3x", label: "More interview calls with AI resumes" },
  { value: "24/7", label: "Career support, whenever you need it" },
];

// Vertical mono section index label (Namespace-style), pinned right on desktop
const SideLabel = memo(({ children }) => (
  <div className="absolute bottom-0 right-3 top-0 z-10 hidden lg:block">
    <p className="sticky top-24 whitespace-nowrap font-mono text-[14px] uppercase leading-[1.1] tracking-[-0.02em] text-[#0b0b12] [writing-mode:vertical-rl]">
      {children}
    </p>
  </div>
));
SideLabel.displayName = "SideLabel";

const SectionHeading = memo(({ children, className = "" }) => (
  <h2 className={`font-heading text-[32px] font-medium leading-[1.1] tracking-[-0.02em] text-[#0b0b12] sm:text-[38px] lg:text-[44px] lg:tracking-[-0.88px] ${className}`}>
    {children}
  </h2>
));
SectionHeading.displayName = "SectionHeading";

const TestimonialCard = memo(({ testimonial }) => {
  const [lead, ...rest] = testimonial.comment.split(/(?<=\.)\s+/);
  const tail = rest.join(" ");
  return (
    <figure className="flex h-full flex-col border border-black/10 bg-[#faf9f4] p-8 sm:p-10">
      <Quote className="h-8 w-8 shrink-0 rotate-180 text-[#1c32ff]" aria-hidden="true" />
      <blockquote className="mt-6 flex-1 text-[20px] font-normal leading-[1.3] tracking-[-0.01em] text-[#0b0b12] sm:text-[22px]">
        <span className="text-[#1c32ff]">{lead}</span>
        {tail ? ` ${tail}` : ""}
      </blockquote>
      <figcaption className="mt-8 flex items-center gap-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="h-12 w-12 rounded-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="text-[14px] leading-[1.6] text-[#5c6070]">
          <p className="text-[16px] font-semibold text-[#0b0b12]">{testimonial.name}</p>
          <p>{testimonial.role}</p>
        </div>
      </figcaption>
    </figure>
  );
});
TestimonialCard.displayName = "TestimonialCard";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="mt-1">
        <HeroSection />
      </div>

      {/* Results / stats band */}
      <section className="mt-[39px] px-6 lg:px-10">
        <div className="mx-auto max-w-[1464px]">
          <p className="text-center font-mono text-[14px] uppercase leading-[1.1] tracking-[-0.02em] text-[#0b0b12]">
            Trusted by professionals building better careers
          </p>
          <div className="mt-10 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center gap-2 rounded-[4px] bg-[#1c32ff08] px-4 py-10 text-center"
              >
                <p className="font-heading text-[40px] font-medium leading-none tracking-[-0.02em] text-[#1c32ff] lg:text-[48px]">
                  {stat.value}
                </p>
                <p className="max-w-[180px] font-mono text-[12px] uppercase leading-[1.2] tracking-[-0.02em] text-[#5c6070]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mt-24 md:mt-40">
        <div className="relative mx-auto max-w-[1464px] px-6 lg:px-10">
          <SideLabel>01 — Features</SideLabel>
          <div className="max-w-[760px]">
            <SectionHeading>Everything you need to grow your career</SectionHeading>
            <p className="mt-6 text-[18px] leading-[1.4] text-[#5c6070]">
              One platform, from resume to offer letter — AI-built resumes,
              interview practice, live market insight, and a roadmap that keeps
              you moving.
            </p>
          </div>
          <div className="mt-12 md:mt-16">
            <FeatureSection />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mt-24 md:mt-40">
        <div className="relative mx-auto max-w-[1464px] px-6 lg:px-10">
          <SideLabel>02 — Success stories</SideLabel>
          <div className="max-w-[760px]">
            <SectionHeading>The results speak for themselves</SectionHeading>
            <p className="mt-6 text-[18px] leading-[1.4] text-[#5c6070]">
              People use Launch Track to change roles, level up, and land offers
              sooner. Here is what a few of them said.
            </p>
          </div>
          <div className="mt-12 grid gap-2 md:mt-16 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mt-24 md:mt-40">
        <div className="relative mx-auto max-w-[1464px] px-6 lg:px-10">
          <SideLabel>03 — FAQ</SideLabel>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-20">
            <div>
              <SectionHeading>Frequently asked questions</SectionHeading>
              <p className="mt-6 text-[18px] leading-[1.4] text-[#5c6070]">
                Everything you need to know about the platform, pricing, and your
                data.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-black/10">
                  <AccordionTrigger className="py-5 text-left font-heading text-[17px] font-medium tracking-[-0.01em] text-[#0b0b12] hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-[15px] leading-[1.6] text-[#5c6070]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <div className="relative z-10 mx-auto mt-24 max-w-[1384px] px-6 md:px-0 lg:mt-40">
        <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-[#1c32ff] px-6 py-16 lg:py-0">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(100% 100% at 50% 50%, #000 30%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(100% 100% at 50% 50%, #000 30%, transparent 75%)",
            }}
          />
          <div className="relative flex max-w-[841px] flex-col items-center gap-9 text-center">
            <h2 className="font-heading max-w-[720px] text-[36px] font-medium leading-[1.05] tracking-[-0.02em] text-white sm:text-[44px] lg:text-[56px] lg:tracking-[-1.2px]">
              Ready to accelerate your career?
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <NsButton href="/dashboard" variant="white">
                Get started free
              </NsButton>
              <NsButton href="#features" variant="outlineWhite" arrow={false}>
                Explore features
              </NsButton>
            </div>
          </div>
        </div>
        {/* Decorative stacked borders */}
        <div className="mx-2 h-[10px] border-x border-b border-[#1c32ff]" />
        <div className="mx-[22px] h-[10px] border-x border-b border-[#1c32ff]" />
      </div>
    </div>
  );
}
