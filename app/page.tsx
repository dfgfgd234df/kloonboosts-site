"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Socials from "@/components/socials";
import Features from "@/components/features";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Pricing from "@/components/pricing";
import Footer from "@/components/footer";
import Faq from "@/components/faq";
import Reviews from "@/components/reviews";

function HomeContent() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoice");

  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Pricing invoiceId={invoiceId} />
      <Reviews />
      <Faq />
      <Socials />
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
