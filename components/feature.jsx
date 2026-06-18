'use client';

import { cn } from "@/lib/utils";
import {
  IconBrain,
  IconBriefcase,
  IconChartLine,
  IconFileText,
  IconUsers,
  IconTarget,
  IconBulb,
  IconCertificate,
} from "@tabler/icons-react";
import { features } from "@/data/features";
import { motion } from "motion/react";

const iconMap = {
  IconBrain,
  IconBriefcase,
  IconChartLine,
  IconFileText,
  IconUsers,
  IconTarget,
  IconBulb,
  IconCertificate,
};

export function FeatureSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <Feature key={feature.id} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
}

const Feature = ({ title, description, icon, index }) => {
  const IconComponent = iconMap[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay: (index % 4) * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "group/feature relative flex flex-col gap-4 p-5 rounded-xl",
        "border border-border bg-card/40 backdrop-blur-sm",
        "hover:border-primary/25 hover:bg-card/70 hover:-translate-y-1",
        "transition-all duration-300 hover:shadow-md"
      )}
    >
      <div className="absolute inset-0 rounded-xl bg-linear-to-t from-muted/30 to-transparent opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10 w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover/feature:bg-primary group-hover/feature:text-primary-foreground transition-all duration-300 shrink-0">
        {IconComponent && <IconComponent size={20} stroke={1.5} />}
      </div>

      <div className="relative z-10 space-y-1.5">
        <h3 className="text-sm font-semibold text-foreground leading-snug">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};
