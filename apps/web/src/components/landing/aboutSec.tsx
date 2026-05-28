"use client";

import { FC } from "react";

export interface AboutStat {
  label: string;
  value: string;
}

interface AboutSectionProps {
  badgeText?: string;
  title?: string;
  description?: string;
  secondaryDescription?: string;
  stats?: AboutStat[];
}

const defaultStats: AboutStat[] = [
  {
    label: "Forms Created",
    value: "10K+",
  },
  {
    label: "Responses Collected",
    value: "1M+",
  },
  {
    label: "Active Teams",
    value: "500+",
  },
];

const AboutSection: FC<AboutSectionProps> = ({
  badgeText = "About",
  title = "Forms don't have to feel boring.",
  description = `The Boring Form is built around one simple idea:
even the most ordinary interaction on the internet
can feel satisfying.`,
  secondaryDescription = `We combine beautiful visuals, smooth experiences,
and modern infrastructure to make forms feel less
like chores and more like part of the experience.`,
  stats = defaultStats,
}) => {
  return (
    <section
      id="about"
      className="relative min-h-screen overflow-hidden bg-black px-6 py-28 text-white"
    >
      {/* ambient gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,153,255,0.18),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="rounded-[40px] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl md:p-16">
          <p className="mb-6 uppercase tracking-[0.3em] text-pink-400">{badgeText}</p>

          <h2 className="mb-8 bg-[linear-gradient(90deg,#ffffff_0%,#e9d5ff_35%,#c084fc_60%,#22d3ee_100%)] bg-clip-text text-5xl font-bold leading-tight text-transparent drop-shadow-[0_0_30px_rgba(192,132,252,0.25)] md:text-6xl">
            {title}
          </h2>

          <p className="mb-8 text-xl leading-relaxed text-zinc-300">{description}</p>

          <p className="text-lg leading-relaxed text-zinc-500">{secondaryDescription}</p>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
              >
                <h3 className="bg-[linear-gradient(90deg,#ffffff_0%,#c084fc_60%,#22d3ee_100%)] bg-clip-text text-4xl font-bold text-transparent">
                  {stat.value}
                </h3>

                <p className="mt-2 text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
