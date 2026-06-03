import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Programs from "./components/Programs";
import Schedule from "./components/Schedule";
import OnlineTraining from "./components/OnlineTraining";
import JoinUs from "./components/JoinUs";
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
        <JoinUs />
        <Schedule />
        <OnlineTraining />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
