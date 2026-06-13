import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Works from "@/components/Works";
import Contact from "@/components/Contact";
import { About, Marquee, Services, Skills, CropWise, Experience, Education, Footer } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Marquee />
      <Services />
      <Skills />
      <CropWise />
      <Works />
      <Experience />
      <Education />
      <Contact />
      <Footer />
    </>
  );
}
