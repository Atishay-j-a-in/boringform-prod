import { FC, useState } from "react";

interface PricingFeature {
  text: string;
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  highlighted?: boolean;
  features: PricingFeature[];
}

interface PricingSectionProps {
  tiers?: PricingTier[];
}

const defaultTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for personal projects and simple forms.",
    features: [
      { text: "Unlimited basic forms" },
      { text: "100 submissions/month" },
      { text: "Basic analytics" },
      { text: "Public form sharing" },
    ],
  },
  {
    name: "Pro",
    price: "$19",
    description: "Built for creators, startups, and growing teams.",
    highlighted: true,
    features: [
      { text: "Unlimited submissions" },
      { text: "Advanced analytics" },
      { text: "Custom branding" },
      { text: "Protected forms" },
      { text: "Priority support" },
    ],
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "Scalable workflows for large organizations.",
    features: [
      { text: "Team collaboration" },
      { text: "Realtime form editing" },
      { text: "Advanced permissions" },
      { text: "Dedicated infrastructure" },
      { text: "Premium support" },
    ],
  },
];

const PricingSection: FC<PricingSectionProps> = ({ tiers = defaultTiers }) => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <section id="pricing" className="relative overflow-hidden bg-black py-28 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.15),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-zinc-300 backdrop-blur-sm">
            Simple Pricing
          </p>

          <h2 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-[linear-gradient(90deg,#ffffff_0%,#e9d5ff_35%,#c084fc_60%,#22d3ee_100%)] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(192,132,252,0.25)]">
            Pricing
          </h2>

          <p className="text-zinc-400 text-lg leading-8">
            Choose a plan that fits your workflow. Scale from simple forms to advanced collaborative
            systems.
          </p>
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative rounded-3xl border p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
                tier.highlighted
                  ? "border-violet-500/40 bg-gradient-to-b from-violet-500/10 to-cyan-500/5 shadow-[0_0_60px_rgba(168,85,247,0.15)]"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-violet-400/30 bg-violet-500/20 px-4 py-1 text-xs font-medium text-violet-200 backdrop-blur-sm">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-3xl font-bold">{tier.name}</h3>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-6xl font-bold tracking-tight">{tier.price}</span>

                  <span className="pb-2 text-zinc-500">/month</span>
                </div>

                <p className="mt-6 text-zinc-400 leading-7">{tier.description}</p>
              </div>

              <div className="mt-10 space-y-4">
                {tier.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
                      ✓
                    </div>

                    <span className="text-zinc-300">{feature.text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowComingSoon(true)}
                className={`mt-12 w-full rounded-2xl px-6 py-4 text-lg font-semibold transition-all duration-300 ${
                  tier.highlighted
                    ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:scale-[1.02]"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {tier.price === "$0" ? "Get Started" : "Pay Now"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center shadow-2xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-4xl">
              🚀
            </div>

            <h3 className="text-3xl font-bold bg-[linear-gradient(90deg,#ffffff_0%,#e9d5ff_40%,#22d3ee_100%)] bg-clip-text text-transparent">
              Coming Soon
            </h3>

            <p className="mt-4 text-zinc-400 leading-7">
              Payments and premium plans are currently under development. Stay tuned for launch
              updates.
            </p>

            <button
              onClick={() => setShowComingSoon(false)}
              className="mt-8 w-full rounded-2xl bg-white px-6 py-4 font-semibold text-black transition-all hover:scale-[1.02]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PricingSection;
