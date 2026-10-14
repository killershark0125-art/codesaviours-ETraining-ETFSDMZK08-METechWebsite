
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Footer from "./components/Footer";

function App() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <section className="approach section-shell" id="approach">
          <div className="approach-label" data-reveal>
            <p className="eyebrow">
              <span className="section-number">01</span>
              THE ME APPROACH
            </p>

            <span className="approach-symbol" aria-hidden="true">
              M<span>E</span>
            </span>
          </div>

          <div className="approach-copy" data-reveal>
            <h2>
              The future doesn't
              <br />
              <span>build itself.</span>
            </h2>

            <p className="approach-lead">
              It takes thoughtful design, sound engineering, and a willingness
              to solve the right problems.
            </p>

            <p className="approach-detail">
              ME Technologies brings engineering, energy, design, and
              technical learning together under one vision: Smart Engineering
              Today. Sustainable Tomorrow.
            </p>

            <a className="underlined-link" href="#services">
              See what we do <span aria-hidden="true">↘</span>
            </a>
          </div>

          <div className="approach-foot" aria-hidden="true">
            <span>THINK CLEARLY.</span>
            <span>DESIGN INTENTIONALLY.</span>
            <span>BUILD FOR TOMORROW.</span>
          </div>
        </section>

        <Services />
        <Footer />
      </main>
    </>
  );
}

export default App;
