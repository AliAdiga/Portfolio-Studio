import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { Services, About, Process } from "@/components/Sections";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <Services />
      <About />
      <Process />
      <ContactSection />
    </>
  );
}
