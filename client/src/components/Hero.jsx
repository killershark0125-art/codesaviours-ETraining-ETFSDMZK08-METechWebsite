
import heroImage from "../assets/hero.png";

export default function Hero() {
  return (
    <section className="hero section-shell" id="home">
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow">
          <span className="pulse-dot" />
          ENGINEERING · ENERGY · DESIGN
        </p>

        <h1 className="hero-title">
          <span className="title-line line-one">Ideas,</span>
          <span className="title-line line-two">engineered</span>
          <span className="title-line line-three">
            <em>into impact.</em>
          </span>
        </h1>

        <div className="hero-bottom">
          <div className="hero-statement">
            <span className="statement-rule" />
            <p>
              Smart Engineering Today.
              <br />
              <strong>Sustainable Tomorrow.</strong>
            </p>
          </div>

          <a className="hero-link" href="#services">
            <span>Explore our expertise</span>
            <span className="link-arrow" aria-hidden="true">↘</span>
          </a>
        </div>
      </div>

      <div className="hero-art" aria-label="Engineering visual">
        <div className="art-topline">
          <span>ME TECHNOLOGIES</span>
          <span>01 — 06</span>
        </div>

        <div className="art-image">
          <img src={heroImage} alt="Engineering and infrastructure" />
          <div className="art-image-shade" />
        </div>

        <div className="draft-grid" aria-hidden="true" />

        <svg
          className="route-drawing"
          viewBox="0 0 500 560"
          fill="none"
          aria-hidden="true"
        >
          <path
            className="route-path"
            d="M48 420 H126 V335 H204 V248 H288 V172 H365 V90 H450"
          />
          <path
            className="route-path route-path-secondary"
            d="M48 448 H150 V363 H230 V276 H314 V200 H391 V118 H450"
          />
          <circle className="route-node node-one" cx="126" cy="335" r="5" />
          <circle className="route-node node-two" cx="288" cy="172" r="5" />
          <circle className="route-node node-three" cx="450" cy="90" r="5" />
          <path className="crosshair" d="M288 145 V199 M261 172 H315" />
        </svg>

        <div className="art-coordinate coordinate-top">
          <span className="coordinate-dot" />
          CONNECTING IDEAS TO REALITY
        </div>

        <div className="art-coordinate coordinate-bottom">
          <span>ENERGY</span>
          <i />
          <span>STRUCTURES</span>
          <i />
          <span>SYSTEMS</span>
        </div>

        <div className="art-side-label">THINK / DESIGN / ENGINEER</div>
        <span className="art-corner corner-tl" />
        <span className="art-corner corner-br" />
      </div>

      <a className="hero-scroll" href="#approach">
        <span className="scroll-track"><span /></span>
        <span>SCROLL TO EXPLORE</span>
      </a>
    </section>
  );
}
