import { projects } from "@/content/projects";
import { Hero } from "@/components/Hero";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { WorkIntro, Services, About, Process } from "@/components/Sections";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <WorkIntro />
      {projects.map((p) => (
        <ProjectShowcase key={p.slug} project={p} />
      ))}
      <Services />
      <About />
      <Process />
      <ContactSection />
    </>
  );
}
