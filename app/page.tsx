import Hero from "../components/ui/common/Hero";
import Footer from "../components/ui/common/Footer";
import WorkSection from "../components/ui/common/WorkSection";
import ExperienceSection from "../components/ui/common/ExperienceSection";
import ContactSection from "../components/ui/common/ContactSection";
import Navbar from "../components/ui/common/Navbar";
import ScrollToTopButton from "../components/ui/common/ScrollToTopButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-10 mt-10 space-y-20">
        <Hero />
        <WorkSection />
        <ExperienceSection />
        <ContactSection />
        <ScrollToTopButton />
      </main>

      <Footer />
    </>
  );
}
