import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { MoreWebsites } from "@/components/MoreWebsites";
import { Services, About, Process } from "@/components/Sections";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <MoreWebsites />
      <Services />
      <About />
      <Process />
      <ContactSection />
    </>
  );
}
