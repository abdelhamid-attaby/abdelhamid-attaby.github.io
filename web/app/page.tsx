import Masthead from '@/components/Masthead';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Research from '@/components/Research';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AskBar from '@/components/AskBar';

export default function Home() {
  return (
    <>
      <Masthead />

      <main id="main">
        <Hero />

        <Section id="about" label="About" file="about.md">
          <About />
        </Section>

        <Section id="skills" label="Skills" file="skills.json" alt>
          <Skills />
        </Section>

        <Section id="experience" label="Experience" file="experience.log">
          <Experience />
        </Section>

        <Section id="projects" label="Projects" file="projects/" alt>
          <Projects />
        </Section>

        <Section id="research" label="Research &amp; education" file="research.bib">
          <Research />
        </Section>

        <Section id="contact" label="Contact" file="contact.sh" alt>
          <Contact />
        </Section>
      </main>

      <Footer />
      <AskBar />
    </>
  );
}
