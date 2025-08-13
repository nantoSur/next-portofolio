import type { HeroSection } from "@/lib/types/hero-section";

interface HeroProps {
  data: HeroSection;
}

export default function Hero({ data }: HeroProps) {
  const { title, highlight, description } = data;

  return (
    <section id="about" className="w-full">
      <div className="max-w-5xl mx-auto px-6 mt-16 text-left">
        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-4 break-words">
          {title}
        </h1>

        {/* HIGHLIGHT */}
        <p className="text-lg md:text-xl font-medium leading-relaxed mb-4">
          <span className="inline-block bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md text-black dark:text-white">
            {highlight}
          </span>
        </p>

        {/* DESCRIPTION */}
        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
          {description}
        </p>
      </div>
    </section>
  );
}
