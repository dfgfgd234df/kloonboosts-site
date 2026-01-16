import Socials from "@/components/socials";
import Features from "@/components/features";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Pricing from "@/components/pricing";
import Footer from "@/components/footer";
import Faq from "@/components/faq";
import Reviews from "@/components/reviews";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Reviews />
      <Faq />
      <Socials />
      <Footer />
    </div>
  );
}
