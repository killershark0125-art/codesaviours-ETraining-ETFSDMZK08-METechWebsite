import { useEffect, useState } from "react";
import { Link, useRouter } from "../router";

const navItems = [
  ["About", "/about"],
  ["Services", "/services"],
  ["EV Charging", "/ev-charging"],
  ["Training", "/training"],
  ["Projects", "/projects"],
  ["Journal", "/blog"],
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { path } = useRouter();
  return (
    <header className="site-header">
<Link
  to="/"
  className="brand-lockup"
  aria-label="ME Technologies home"
  onClick={() => setMenuOpen(false)}
>
  <img
    src="/assets/brand/me-technologies-logo.png"
    alt="ME Technologies — Smart Engineering Today. Sustainable Tomorrow."
    className="brand-logo-full"
  />
</Link>
      <button
        className="mobile-menu-button"
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
      </button>
      <nav
        className={`main-nav ${menuOpen ? "is-open" : ""}`}
        aria-label="Main navigation"
      >
        {navItems.map(([label, href]) => (
          <Link
            key={href}
            to={href}
            className={
              path.split("?")[0] === href ||
              (href === "/services" && path.startsWith("/services/"))
                ? "active"
                : ""
            }
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        <Link
          to="/quote"
          className="nav-cta"
          onClick={() => setMenuOpen(false)}
        >
          Start a project <span>↗</span>
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo-plate">
            <img
              src="/assets/brand/logo.png"
              alt="ME Technologies official logo"
            />
          </div>
          <div>
            <span className="eyebrow">ENGINEERING WITH PURPOSE</span>
            <p>
              Smart Engineering Today.
              <br />
              <em>Sustainable Tomorrow.</em>
            </p>
          </div>
        </div>
        <div className="footer-col">
          <span className="eyebrow">EXPLORE</span>
          <Link to="/about">About us</Link>
          <Link to="/services">Our services</Link>
          <Link to="/projects">Selected projects</Link>
          <Link to="/training">Training</Link>
        </div>
        <div className="footer-col">
          <span className="eyebrow">GET IN TOUCH</span>
          <a href="tel:03166379325">0316 6379325</a>
          <a href="https://wa.me/923166379325" target="_blank" rel="noreferrer">
            WhatsApp ↗
          </a>
          <Link to="/contact">Contact us</Link>
          <Link to="/quote">Request a quote</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ME Technologies</span>
        <span>Built around better questions and better engineering.</span>
        <Link to="/admin/login">Admin ↗</Link>
      </div>
    </footer>
  );
}

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href="https://wa.me/923166379325"
      target="_blank"
      rel="noreferrer"
      aria-label="Contact ME Technologies on WhatsApp"
    >
      <span>↗</span>
    </a>
  );
}

export default function SiteLayout({ children }) {
  const { path } = useRouter();
  useEffect(() => {
    document.documentElement.dataset.route = path.split("?")[0];
  }, [path]);
  return (
    <div className="site-shell">
      <SiteHeader />
      {children}
      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}
