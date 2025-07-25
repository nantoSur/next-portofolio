import Hero from "./components/Hero";
import WorkSection from "./components/WorkSection";
import ExperienceSection from "./components/ExperienceSection";

export default function Home() {
  return (
    <main className="mt-10 space-y-20">
      <Hero />
      <WorkSection />
      <ExperienceSection />
    </main>
  );
}
