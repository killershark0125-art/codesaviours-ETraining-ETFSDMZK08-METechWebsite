
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <a href="#home" className="brand" aria-label="ME Technologies home">
        <img
          src="/assets/brand/logo.png"
          alt="ME Technologies"
          className="brand-logo"
        />
      </a>

      <span className="nav-descriptor">ENGINEERING / TECHNOLOGY</span>

      <button
        className={`menu-toggle ${menuOpen ? "menu-active" : ""}`}
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
      >
        <span />
        <span />
      </button>

      <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
        <a href="#approach" onClick={closeMenu}>
          Approach
        </a>
        <a href="#services" onClick={closeMenu}>
          Capabilities
        </a>
        <a className="nav-contact" href="#contact" onClick={closeMenu}>
          Start a conversation <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  );
}
