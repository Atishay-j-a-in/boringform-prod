import { FC } from "react";

export interface ReviewItem {
  name: string;
  role: string;
  review: string;
}

interface ReviewsSectionProps {
  title?: string;
  subtitle?: string;
  reviews: ReviewItem[];
}

const ReviewsSection: FC<ReviewsSectionProps> = ({
  title = "Loved by creators",
  subtitle = "Teams are building satisfying form experiences using Boring Form.",
  reviews,
}) => {
  return (
    <section
      id="reviews"
      className=" relative min-h-screen overflow-hidden bg-black px-6 py-28 text-white"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-[linear-gradient(90deg,#fff,#c084fc,#22d3ee,#fff)] bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
          {title}
        </h2>

        <p className="text-zinc-400 text-center max-w-2xl mx-auto mb-16 text-lg">{subtitle}</p>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-zinc-300 leading-7 mb-6">"{review.review}"</p>

              <div>
                <h3 className="font-semibold text-lg">{review.name}</h3>

                <p className="text-zinc-500">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
