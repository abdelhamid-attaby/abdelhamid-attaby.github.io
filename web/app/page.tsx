import Sidebar from '@/components/Sidebar';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Recommendations from '@/components/Recommendations';
import Research from '@/components/Research';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AskBar from '@/components/AskBar';
import { IconUser, IconBriefcase, IconFolder, IconQuote, IconBook, IconMail } from '@/components/Icons';

export default function Home() {
  return (
    <div className="app">
      <Sidebar />

      <main id="main" className="main">
        <Hero />

        <Section id="about" label="About" icon={IconUser}>
          <About />
          <Skills />
        </Section>

        <Section id="experience" label="Experience" icon={IconBriefcase}>
          <Experience />
        </Section>

        <Section id="projects" label="Projects" icon={IconFolder}>
          <Projects />
        </Section>

        <Section id="recommendations" label="Recommendations" icon={IconQuote}>
          <Recommendations />
        </Section>

        <Section id="research" label="Research &amp; education" icon={IconBook}>
          <Research />
        </Section>

        <Section id="contact" label="Contact" icon={IconMail}>
          <Contact />
        </Section>

        <Footer />
      </main>

      <AskBar />
    </div>
  );
}
