import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Programs from "./components/Programs";
import Schedule from "./components/Schedule";
import OnlineTraining from "./components/OnlineTraining";
import Instructors from "./components/Instructors";
import JoinUs from "./components/JoinUs";
import PhotoBanner from "./components/PhotoBanner";
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
        <Instructors />
        <JoinUs />
        <Schedule />
        <PhotoBanner />
        <OnlineTraining />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
