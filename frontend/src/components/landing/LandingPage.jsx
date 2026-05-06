import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import FeaturesSection from "./FeaturesSection";
import DemoSection from "./DemoSection";
import PricingSection from "./PricingSection";
import TestimonialsSection from "./TestimonialsSection";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";


export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0d1117" }}>
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}