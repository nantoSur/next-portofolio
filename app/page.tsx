import Hero from "../components/ui/common/Hero";
import Footer from "../components/ui/common/Footer";
import WorkSection from "../components/ui/common/WorkSection";
import ExperienceSection from "../components/ui/common/ExperienceSection";
import ContactSection from "../components/ui/common/ContactSection";
import Navbar from "../components/ui/common/Navbar";
import ScrollToTopButton from "../components/ui/common/ScrollToTopButton";
import { getHeroSection } from "@/lib/actions/hero-section/get";

export default async function Home() {
  const hero = await getHeroSection();

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-10 mt-10 space-y-20">
        {hero && <Hero data={hero} />}
        <WorkSection />
        <ExperienceSection />
        <ContactSection />
        <ScrollToTopButton />
      </main>

      <Footer />
    </>
  );
}
