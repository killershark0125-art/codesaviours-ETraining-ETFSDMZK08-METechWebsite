
const services = [
  {
    number: "01",
    name: "Electrical engineering",
    detail: "Electrical systems, power, and engineering solutions.",
  },
  {
    number: "02",
    name: "Solar PV & energy storage",
    detail: "Solar photovoltaic systems and battery storage.",
  },
  {
    number: "03",
    name: "EV charging",
    detail: "Charging infrastructure for electric mobility.",
  },
  {
    number: "04",
    name: "Architecture & building design",
    detail: "Building design, planning, and the built environment.",
  },
  {
    number: "05",
    name: "Civil & structural engineering",
    detail: "Civil engineering and structural design services.",
  },
  {
    number: "06",
    name: "Technical training",
    detail: "Technical learning and engineering development.",
  },
];

export default function Services() {
  return (
    <section className="services section-shell" id="services">
      <div className="services-heading" data-reveal>
        <p className="eyebrow">
          <span className="section-number">02</span>
          OUR CAPABILITIES
        </p>

        <div className="services-heading-main">
          <h2>
            Different disciplines.
            <br />
            <span>One forward direction.</span>
          </h2>

          <p>
            Practical engineering expertise across energy, buildings,
            infrastructure, and technical learning.
          </p>
        </div>
      </div>

      <div className="service-list">
        {services.map((service) => (
          <a
            className="service-row"
            href="#contact"
            key={service.number}
            data-reveal
          >
            <span className="service-index">{service.number}</span>

            <div className="service-main">
              <h3>{service.name}</h3>
              <p>{service.detail}</p>
            </div>

            <span className="service-row-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </div>

      <div className="services-bottom">
        <span>BUILT AROUND REAL-WORLD NEEDS</span>
        <a href="#contact">
          Discuss a project <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
