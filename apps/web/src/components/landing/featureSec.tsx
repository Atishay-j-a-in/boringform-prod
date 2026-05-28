import { FC } from "react";
import { Sparkles, Wand2, ShieldCheck, Zap, LucideIcon } from "lucide-react";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
  features?: FeatureItem[];
}

const defaultFeatures: FeatureItem[] = [
  {
    icon: Sparkles,
    title: "Beautiful Forms",
    description: "Create visually satisfying forms that people actually enjoy filling.",
  },
  {
    icon: Zap,
    title: "Instant Responses",
    description: "Collect and manage submissions in real time with zero friction.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description: "Protected forms with fast infrastructure and reliable delivery.",
  },
  {
    icon: Wand2,
    title: "Custom Experience",
    description: "Design forms that match your brand and aesthetic perfectly.",
  },
];

const FeaturesSection: FC<FeaturesSectionProps> = ({
  title = "Features",
  subtitle = "Powerful form building wrapped in a satisfying visual experience.",
  features = defaultFeatures,
}) => {
  return (
    <section
      id="features"
      className="relative min-h-screen overflow-hidden bg-black px-6 py-28 text-white"
    >
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,128,0.15),transparent_40%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-[linear-gradient(90deg,#fff,#c084fc,#22d3ee,#fff)] bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
          {title}
        </h2>

        <p className="mx-auto mb-20 max-w-2xl text-center text-lg text-zinc-400">{subtitle}</p>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:bg-white/10"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-orange-400 to-blue-500 shadow-lg">
                  <Icon className="h-7 w-7 text-white" />
                </div>

                <h3 className="mb-4 text-2xl font-semibold">{feature.title}</h3>

                <p className="leading-relaxed text-zinc-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
