import { projects } from "@/content/projects";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { StackCard } from "@/components/StackCard";
import { WorkIntro, Services, About, Process } from "@/components/Sections";
import { ContactSection } from "@/components/ContactSection";
import { Divider } from "@/components/Divider";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <WorkIntro />
      {/* Each project is a sticky sheet that the next one slides over (native sticky, no scroll hijack). */}
      <div data-nav="work">
        {projects.map((p, i) => (
          <StackCard key={p.slug} z={10 + i}>
            <ProjectShowcase project={p} />
          </StackCard>
        ))}
      </div>
      <Services />
      <About />
      <Process />
      <ContactSection />
      <Divider from="var(--c-sand)" to="#3a2230" />
    </>
  );
}
