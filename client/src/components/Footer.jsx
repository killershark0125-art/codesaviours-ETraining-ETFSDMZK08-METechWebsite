
export default function Footer() {
  return (
    <>
      <section className="contact section-shell" id="contact">
        <div className="contact-inner" data-reveal>
          <p className="eyebrow">
            <span className="section-number">03</span>
            HAVE SOMETHING IN MIND?
          </p>

          <h2>
            Let's make
            <br />
            <span>it happen.</span>
          </h2>

          <div className="contact-bottom">
            <p>
              Have an engineering requirement or want to discuss a potential
              project? Start a conversation with ME Technologies.
            </p>

            <a className="contact-link" href="tel:03166379325">
              <span>Call 0316 6379325</span>
              <span className="contact-link-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="footer section-shell">
        <a href="#home" className="footer-brand">
          ME TECHNOLOGIES<span>®</span>
        </a>

        <p>Smart Engineering Today. Sustainable Tomorrow.</p>

        <a className="back-to-top" href="#home">
          Back to top ↑
        </a>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ME Technologies</span>
          <span>ENGINEERED WITH PURPOSE.</span>
        </div>
      </footer>
    </>
  );
}
