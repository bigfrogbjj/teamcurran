import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Programs from "./components/Programs";
import Schedule from "./components/Schedule";
import OnlineTraining from "./components/OnlineTraining";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Programs />
        <Schedule />
        <OnlineTraining />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
