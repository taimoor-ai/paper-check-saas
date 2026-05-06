import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import AboutHero from "./AboutHero";
import EditorialImperative from "./EditorialImperative";
import TargetAudience from "./TargetAudience";
import RoadmapSection from "./RoadmapSection";
import TeamSection from "./TeamSection";
import ContactSection from "./ContactSection";

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0d1117" }}>
      <Navbar />
      <main className="pt-16">
        <AboutHero />
        <EditorialImperative />
        <TargetAudience />
        <RoadmapSection />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}