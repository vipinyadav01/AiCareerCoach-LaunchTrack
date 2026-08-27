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
    <div className="grid grid-cols-1 gap-[2px] overflow-hidden rounded-[4px] border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <Feature key={feature.id} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({ title, description, icon }) => {
  const IconComponent = iconMap[icon];

  return (
    <div className={cn("group flex flex-col gap-5 bg-white p-6 transition-colors hover:bg-[#fbfbff] sm:p-7")}>
      <div className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-[#f0f3ff] text-[#1c32ff] transition-colors group-hover:bg-[#1c32ff] group-hover:text-white">
        {IconComponent && <IconComponent size={20} stroke={1.75} />}
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-[17px] font-medium leading-[1.25] tracking-[-0.01em] text-[#0b0b12]">
          {title}
        </h3>
        <p className="text-[14px] leading-[1.5] text-[#5c6070]">
          {description}
        </p>
      </div>
    </div>
  );
};
