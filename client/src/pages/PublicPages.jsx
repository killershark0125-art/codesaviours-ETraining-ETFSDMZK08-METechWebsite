/* eslint react-hooks/set-state-in-effect: off, react-hooks/exhaustive-deps: off */
import { useEffect, useMemo, useState } from "react";
import { Link } from "../router";
import { apiRequest } from "../services/api";
import { imageUrl } from "../utils/imageUrl";
import HolographicPakistanMap from '../components/HolographicPakistanMap';
import {
  ArticleCard,
  ArrowLink,
  Eyebrow,
  ImageFrame,
  ProjectCard,
  SectionHeading,
  ServiceCard,
  StateMessage,
} from "../components/UI";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2000&q=90";
const ARCH_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85";
const SOLAR_IMAGE =
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=85";
const EV_IMAGE =
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1400&q=85";

function useLoad(loader, deps = []) {
  const [state, setState] = useState({ loading: true, data: null, error: "" });
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setState((current) => ({ ...current, loading: true, error: "" }));
    loader()
      .then((data) => {
        if (active) setState({ loading: false, data, error: "" });
      })
      .catch((error) => {
        if (active)
          setState({
            loading: false,
            data: null,
            error: error.message || "Something went wrong.",
          });
      });
    return () => {
      active = false;
    };
    // loader is deliberately represented by stable dependencies supplied by each page.
  }, [...deps, version]);
  return { ...state, retry: () => setVersion((current) => current + 1) };
}

function PageHero({
  label,
  title,
  description,
  image = HERO_IMAGE,
  compact = false,
  children,
}) {
  return (
    <section className={`page-hero ${compact ? "page-hero-compact" : ""}`}>
      <div
        className="page-hero-image"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(13,20,15,.88) 0%, rgba(13,20,15,.48) 57%, rgba(13,20,15,.12) 100%), linear-gradient(0deg, rgba(13,20,15,.32), transparent 55%), url("${image}")`,
        }}
      />
      <div className="page-hero-inner wrap">
        <Eyebrow>{label}</Eyebrow>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {children}
      </div>
      <span className="hero-side-note">ME TECHNOLOGIES / PAKISTAN</span>
    </section>
  );
}

export function HomePage() {
  const services = useLoad(
    () => apiRequest("/services").then((r) => r.data),
    [],
  );
  const projects = useLoad(
    () => apiRequest("/projects?limit=3&page=1").then((r) => r.data),
    [],
  );
  const courses = useLoad(() => apiRequest("/courses").then((r) => r.data), []);
  const posts = useLoad(
    () => apiRequest("/posts?limit=3&page=1").then((r) => r.data),
    [],
  );
  return (
    <main>
      <section className="home-hero">
        <div
          className="home-hero-backdrop"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(13,20,15,.82), rgba(13,20,15,.14)), linear-gradient(0deg, #101510 0%, transparent 43%), url("${HERO_IMAGE}")`,
          }}
        />
        <div className="wrap home-hero-content">
          <Eyebrow>
            <span className="live-dot" /> ENGINEERING · ENERGY · DESIGN
          </Eyebrow>
          <h1>
            Engineering a<br />
            more <em>sustainable</em>
            <br />
            tomorrow.
          </h1>
          <p>
            We bring engineering thinking and practical design together to shape
            smarter energy, better spaces, and stronger systems.
          </p>
          <div className="hero-actions">
            <ArrowLink to="/services" light>
              Explore our capabilities
            </ArrowLink>
            <Link to="/quote" className="outline-button">
              Discuss a project <span>↗</span>
            </Link>
          </div>
          <div className="hero-footline">
            <span>01 — 06 / ENGINEERING DISCIPLINES</span>
            <span>SMART ENGINEERING TODAY. SUSTAINABLE TOMORROW.</span>
            <a href="#intro" className="scroll-cue">
              SCROLL TO EXPLORE <b>↓</b>
            </a>
          </div>
        </div>
        <div className="hero-coordinate">
          33°41' N<br />
          73°03' E
        </div>
      </section>
      <section className="intro-section wrap" id="intro">
        <div className="intro-kicker">
          <Eyebrow number="01">THE ME APPROACH</Eyebrow>
          <div
            className="approach-visual"
            role="img"
            aria-label="ME Technologies connects energy, engineering and design"
          >
            <span className="approach-coordinate approach-coordinate-top">
              SYSTEMS / 01
            </span>
            <span className="approach-coordinate approach-coordinate-side">
              ENGINEERED TO CONNECT
            </span>
            <span className="approach-axis approach-axis-horizontal" />
            <span className="approach-axis approach-axis-vertical" />
            <span className="approach-orbit approach-orbit-outer" />
            <span className="approach-orbit approach-orbit-middle" />
            <span className="approach-orbit approach-orbit-inner" />
            <span className="approach-node approach-node-one" />
            <span className="approach-node approach-node-two" />
            <span className="approach-node approach-node-three" />
            <div className="approach-core">
              <img src="/assets/brand/logo-mark.png" alt="" />
            </div>
            <span className="approach-label approach-label-energy">ENERGY</span>
            <span className="approach-label approach-label-design">DESIGN</span>
            <span className="approach-label approach-label-systems">
              SYSTEMS
            </span>
            <span className="approach-index">M.E. / 2026</span>
          </div>
        </div>
        <div className="intro-copy">
          <h2>
            Good engineering
            <br />
            makes <em>tomorrow</em>
            <br />
            work better.
          </h2>
          <p className="intro-lead">
            ME Technologies brings engineering, renewable energy, building
            design and technical training together under one practical vision.
          </p>
          <p className="body-muted">
            From early assessment and design through to systems and learning, we
            focus on clear thinking, considered choices, and solutions built
            around real needs.
          </p>
          <ArrowLink to="/about">Get to know us</ArrowLink>
        </div>
        <div className="intro-bottom">
          <span>THINK CLEARLY.</span>
          <span>DESIGN INTENTIONALLY.</span>
          <span>BUILD FOR TOMORROW.</span>
        </div>
      </section>
      <section className="capabilities-section">
        <div className="wrap">
          <SectionHeading
            number="02"
            eyebrow="WHAT WE DO"
            title={
              <>
                Capability with
                <br />
                <em>purpose.</em>
              </>
            }
            copy="A connected set of engineering disciplines, designed to work together around your project."
          />
          <div className="service-list">
            {services.loading ? (
              <StateMessage type="loading" title="Loading our capabilities" />
            ) : services.error ? (
              <StateMessage
                type="error"
                title="Capabilities couldn't load"
                onRetry={services.retry}
              >
                {services.error}
              </StateMessage>
            ) : services.data?.length ? (
              services.data.map((item, i) => (
                <ServiceCard key={item._id} service={item} index={i} />
              ))
            ) : (
              <StateMessage title="Services are being prepared">
                Please check back soon.
              </StateMessage>
            )}
          </div>
          <div className="section-end">
            <span>ENGINEERING / ENERGY / DESIGN</span>
            <ArrowLink to="/services">View all services</ArrowLink>
          </div>
        </div>
      </section>
      <section className="feature-split wrap">
        <div className="feature-image">
          <ImageFrame
            src={SOLAR_IMAGE}
            alt="Solar photovoltaic panels in the sun"
          />
          <div className="image-caption">
            <span>01 / RENEWABLE ENERGY</span>
            <span>DESIGNING FOR WHAT'S NEXT</span>
          </div>
        </div>
        <div className="feature-copy">
          <Eyebrow number="03">ENERGY IN TRANSITION</Eyebrow>
          <h2>
            Powering progress.
            <br />
            <em>Responsibly.</em>
          </h2>
          <p>
            Solar PV, battery energy storage and EV charging are changing how
            energy is generated, stored and used. We bring these systems into
            one engineering conversation.
          </p>
          <div className="feature-tags">
            <span>Solar PV</span>
            <span>BESS</span>
            <span>EV Charging</span>
          </div>
          <ArrowLink to="/ev-charging">Explore EV charging</ArrowLink>
        </div>
      </section>
      <section className="projects-section">
        <div className="wrap">
          <SectionHeading
            number="04"
            eyebrow="SELECTED WORK"
            title={
              <>
                Designed to make
                <br />
                <em>a difference.</em>
              </>
            }
            copy="Explore our project showcase and the thinking behind each solution."
          />
          <div className="project-grid">
            {projects.loading ? (
              <StateMessage type="loading" title="Loading projects" />
            ) : projects.error ? (
              <StateMessage
                type="error"
                title="Projects couldn't load"
                onRetry={projects.retry}
              >
                {projects.error}
              </StateMessage>
            ) : projects.data?.length ? (
              projects.data
                .slice(0, 3)
                .map((p) => <ProjectCard key={p._id} project={p} />)
            ) : (
              <StateMessage title="Project stories are coming soon">
                Published projects will appear here once added by the team.
              </StateMessage>
            )}
          </div>
          <div className="section-end">
            <span>PROJECTS / CASE STUDIES / LOCATIONS</span>
            <ArrowLink to="/projects">Explore the work</ArrowLink>
          </div>
        </div>
      </section>
      <section className="training-feature wrap">
        <div className="training-text">
          <Eyebrow number="05">LEARN WITH ME</Eyebrow>
          <h2>
            Build skills
            <br />
            for the <em>real world.</em>
          </h2>
          <p>
            Online Solar Design Training introduces learners to solar system
            simulation and 3D modelling with PVsyst and SketchUp.
          </p>
          {courses.error && (
            <p className="inline-note">
              Training details are temporarily unavailable. Please contact us
              for information.
            </p>
          )}
          <ArrowLink to="/training">Explore training</ArrowLink>
        </div>
        <div className="training-visual">
          <ImageFrame
            src={ARCH_IMAGE}
            alt="Modern collaborative engineering workspace"
          />
          <div className="training-stamp">
            <span>DESIGN</span>
            <b>↗</b>
            <span>LEARN</span>
          </div>
          <div className="training-tool-list">
            <span>PVsyst</span>
            <span>SketchUp</span>
            <span>Solar Design</span>
          </div>
        </div>
      </section>
      <section className="journal-section">
        <div className="wrap">
          <SectionHeading
            number="06"
            eyebrow="THINKING AHEAD"
            title={
              <>
                Notes on the
                <br />
                <em>energy future.</em>
              </>
            }
            copy="Perspectives and useful information from the wider world of engineering and energy."
          />
          <div className="article-grid">
            {posts.loading ? (
              <StateMessage type="loading" title="Loading articles" />
            ) : posts.error ? (
              <StateMessage
                type="error"
                title="Articles couldn't load"
                onRetry={posts.retry}
              >
                {posts.error}
              </StateMessage>
            ) : posts.data?.length ? (
              posts.data
                .slice(0, 3)
                .map((p) => <ArticleCard key={p._id} post={p} />)
            ) : (
              <StateMessage title="The journal is being prepared">
                Published articles will appear here when available.
              </StateMessage>
            )}
          </div>
          <div className="section-end">
            <span>IDEAS / INSIGHTS / EXPLAINERS</span>
            <ArrowLink to="/blog">Visit the journal</ArrowLink>
          </div>
        </div>
      </section>
      <section className="closing-cta">
        <div className="wrap closing-inner">
          <Eyebrow>HAVE A PROJECT IN MIND?</Eyebrow>
          <h2>
            Let's make the
            <br />
            <em>next step count.</em>
          </h2>
          <div>
            <p>
              Tell us what you're working on. We'll start with the right
              questions.
            </p>
            <ArrowLink to="/quote" light>
              Start a conversation
            </ArrowLink>
          </div>
          <span className="cta-watermark">ME</span>
        </div>
      </section>
    </main>
  );
}

export function AboutPage() {
  return (
    <main>
      <PageHero
        label="ABOUT ME TECHNOLOGIES"
        title={
          <>
            Engineering with
            <br />
            <em>a longer view.</em>
          </>
        }
        description="A connected approach to engineering, energy, building design and technical learning."
        image={ARCH_IMAGE}
      />
      <section className="story-section wrap">
        <div>
          <Eyebrow number="01">OUR POINT OF VIEW</Eyebrow>
          <h2>
            Better outcomes begin with <em>better questions.</em>
          </h2>
        </div>
        <div className="story-copy">
          <p>
            ME Technologies works across engineering consultancy and technical
            training, connecting practical design choices with the way people
            use energy, spaces and systems.
          </p>
          <p>
            Our work spans electrical engineering, solar PV, battery energy
            storage, EV charging, architecture and building design, and civil
            and structural engineering.
          </p>
          <p>
            The goal is straightforward: make complex technical decisions
            clearer and create solutions shaped around the project, its people
            and its future.
          </p>
          <ArrowLink to="/services">Explore our capabilities</ArrowLink>
        </div>
      </section>
      <section className="values-section">
        <div className="wrap">
          <SectionHeading
            eyebrow="OUR APPROACH"
            title={
              <>
                Thoughtful by design.
                <br />
                <em>Practical by nature.</em>
              </>
            }
          />
          <div className="values-grid">
            <article>
              <span>01</span>
              <h3>Understand first</h3>
              <p>
                Start with the context, constraints and real needs behind the
                brief.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Connect the systems</h3>
              <p>
                Consider energy, infrastructure, design and operation as
                connected decisions.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Make it useful</h3>
              <p>Turn technical thinking into clear, actionable direction.</p>
            </article>
          </div>
        </div>
      </section>
      <section className="cta-strip wrap">
        <div>
          <Eyebrow>READY TO TALK?</Eyebrow>
          <h2>Bring us your question.</h2>
        </div>
        <ArrowLink to="/contact">Contact ME Technologies</ArrowLink>
      </section>
    </main>
  );
}

export function ServicesPage() {
  const state = useLoad(() => apiRequest("/services").then((r) => r.data), []);
  return (
    <main>
      <PageHero
        label="OUR CAPABILITIES"
        title={
          <>
            Engineering for
            <br />
            <em>real-world needs.</em>
          </>
        }
        description="A multidisciplinary approach across electrical systems, energy, buildings and infrastructure."
        image={HERO_IMAGE}
      />
      <section className="service-page wrap">
        <SectionHeading
          eyebrow="DISCIPLINES"
          title={
            <>
              Six capabilities.
              <br />
              <em>One connected view.</em>
            </>
          }
          copy="Select a discipline to explore the service information available."
        />
        {state.loading ? (
          <StateMessage type="loading" title="Loading services" />
        ) : state.error ? (
          <StateMessage
            type="error"
            title="Services couldn't load"
            onRetry={state.retry}
          >
            {state.error}
          </StateMessage>
        ) : (
          <div className="service-list light-service-list">
            {state.data?.map((service, i) => (
              <ServiceCard key={service._id} service={service} index={i} />
            ))}
          </div>
        )}
        <div className="service-note">
          <span>01 — ENGINEERING</span>
          <p>
            Service details are maintained by the ME Technologies team and
            updated from the content management system.
          </p>
        </div>
      </section>
    </main>
  );
}

export function ServiceDetailPage({ slug }) {
  const state = useLoad(
    () =>
      apiRequest(`/services/${encodeURIComponent(slug)}`).then((r) => r.data),
    [slug],
  );
  if (state.loading)
    return (
      <main className="wrap page-padded">
        <StateMessage type="loading" title="Loading service" />
      </main>
    );
  if (state.error)
    return (
      <main className="wrap page-padded">
        <StateMessage
          type="error"
          title="Service unavailable"
          onRetry={state.retry}
        >
          {state.error}
        </StateMessage>
        <ArrowLink to="/services">Back to services</ArrowLink>
      </main>
    );
  const service = state.data;
  return (
    <main>
      <PageHero
        label="OUR CAPABILITIES"
        title={
          <>
            {service.title.split(" ").slice(0, -1).join(" ")}
            <br />
            <em>{service.title.split(" ").slice(-1).join(" ")}</em>
          </>
        }
        description={service.shortText}
        image={
          service.slug === "solar-pv"
            ? SOLAR_IMAGE
            : service.slug === "ev-charging"
              ? EV_IMAGE
              : ARCH_IMAGE
        }
      >
        <ArrowLink to="/quote" light>
          Discuss this service
        </ArrowLink>
      </PageHero>
      <section className="detail-section wrap">
        <div>
          <Eyebrow number="01">OVERVIEW</Eyebrow>
          <h2>
            Technical clarity.
            <br />
            <em>Considered solutions.</em>
          </h2>
        </div>
        <div>
          <p>
            {service.description ||
              service.shortText ||
              "Contact ME Technologies to discuss your requirements and learn more about this service."}
          </p>
          <p>
            Every project starts with understanding the context, constraints,
            and outcomes that matter to you.
          </p>
          <ArrowLink to="/quote">Request a consultation</ArrowLink>
        </div>
      </section>
      <section className="image-break">
        <ImageFrame
          src={service.slug === "solar-pv" ? SOLAR_IMAGE : ARCH_IMAGE}
          alt={service.title}
        />
        <div className="image-break-caption">
          <span>ME TECHNOLOGIES</span>
          <span>{service.title.toUpperCase()}</span>
        </div>
      </section>
      <section className="cta-strip wrap">
        <div>
          <Eyebrow>LET'S DISCUSS YOUR NEEDS</Eyebrow>
          <h2>Start with a conversation.</h2>
        </div>
        <ArrowLink to="/contact">Get in touch</ArrowLink>
      </section>
    </main>
  );
}

export function EVChargingPage() {
  return (
    <main>
      <PageHero
        label="ELECTRIC MOBILITY"
        title={
          <>
            Charge forward.
            <br />
            <em>Engineer the system.</em>
          </>
        }
        description="EV charging infrastructure designed as a connected system—from grid capacity and storage to charging and monitoring."
        image={EV_IMAGE}
      >
        <ArrowLink to="/quote" light>
          Discuss EV charging
        </ArrowLink>
      </PageHero>
      <section className="story-section wrap">
        <div>
          <Eyebrow number="01">BEYOND THE CHARGER</Eyebrow>
          <h2>
            Infrastructure that works <em>together.</em>
          </h2>
        </div>
        <div className="story-copy">
          <p>
            A complete EV charging setup needs more than a charger. It may
            involve load assessment, grid upgrades, energy storage for peak
            shaving, solar integration and intelligent energy management.
          </p>
          <p>
            ME Technologies' project brief identifies multi-standard charging
            support including CCS2, GB/T and Type 2, with OCPP 1.6J for
            compatible monitoring workflows.
          </p>
          <p>
            Actual site design and equipment selection depend on the project's
            electrical capacity, usage profile, location and applicable
            requirements.
          </p>
          <ArrowLink to="/quote">Request an assessment</ArrowLink>
        </div>
      </section>
      <section className="ev-spec-section">
        <div className="wrap">
          <SectionHeading
            eyebrow="SYSTEM ELEMENTS"
            title={
              <>
                A connected charging
                <br />
                <em>ecosystem.</em>
              </>
            }
          />
          <div className="ev-grid">
            <article>
              <span>01 / GRID</span>
              <h3>Load assessment</h3>
              <p>
                Understand capacity, load requirements and possible grid
                upgrades.
              </p>
            </article>
            <article>
              <span>02 / ENERGY</span>
              <h3>Solar + storage</h3>
              <p>
                Consider solar PV and BESS where they support the site's energy
                needs.
              </p>
            </article>
            <article>
              <span>03 / CHARGING</span>
              <h3>AC + DC charging</h3>
              <p>
                The brief references AC 7–22 kW and DC charging up to 360 kW,
                subject to project needs.
              </p>
            </article>
            <article>
              <span>04 / CONTROL</span>
              <h3>Monitoring and EMS</h3>
              <p>
                Plan for smart energy management and compatible charging
                communication.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="cta-strip wrap">
        <div>
          <Eyebrow>EV CHARGING / GRID TO CHARGER</Eyebrow>
          <h2>Plan the full system.</h2>
        </div>
        <ArrowLink to="/contact">Talk to our team</ArrowLink>
      </section>
    </main>
  );
}

export function TrainingPage() {
  const state = useLoad(() => apiRequest("/courses").then((r) => r.data), []);
  return (
    <main>
      <PageHero
        label="TRAINING / PROFESSIONAL LEARNING"
        title={
          <>
            Learn the tools.
            <br />
            <em>Build your practice.</em>
          </>
        }
        description="Online Solar Design Training for undergraduate students and fresh graduates, introducing PVsyst and SketchUp."
        image={ARCH_IMAGE}
      />
      <section className="training-page wrap">
        <SectionHeading
          eyebrow="PROGRAMS"
          title={
            <>
              Training built around
              <br />
              <em>applied skills.</em>
            </>
          }
          copy="Explore the currently available program and contact us for information on fees, duration and upcoming batches."
        />
        {state.loading ? (
          <StateMessage type="loading" title="Loading programs" />
        ) : state.error ? (
          <StateMessage
            type="error"
            title="Training information couldn't load"
            onRetry={state.retry}
          >
            {state.error}
          </StateMessage>
        ) : state.data?.length ? (
          <div className="course-grid">
            {state.data.map((course) => (
              <article className="course-card" key={course._id}>
                <ImageFrame
                  src={course.image}
                  alt={course.title}
                  fallback={ARCH_IMAGE}
                />
                <div className="course-card-copy">
                  <Eyebrow>
                    {course.tools?.join(" / ") || "TECHNICAL TRAINING"}
                  </Eyebrow>
                  <h3>{course.title}</h3>
                  <div className="course-facts">
                    <span>
                      {course.duration || "Duration shared on enquiry"}
                    </span>
                    <span>
                      {typeof course.fee === "number"
                        ? `PKR ${course.fee.toLocaleString()}`
                        : "Contact us for fee"}
                    </span>
                  </div>
                  <ArrowLink to={`/training/${course.slug}`}>
                    View program
                  </ArrowLink>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <StateMessage title="No published programs available">
            Please contact ME Technologies to ask about upcoming training.
          </StateMessage>
        )}
      </section>
      <section className="training-note-section">
        <div className="wrap training-note">
          <Eyebrow>WHO IT'S FOR</Eyebrow>
          <h2>
            Students and fresh graduates ready to develop{" "}
            <em>practical design skills.</em>
          </h2>
          <p>
            The currently seeded program references PVsyst for system simulation
            and performance analysis, and SketchUp for 3D modelling and
            structural design.
          </p>
          <ArrowLink to="/contact">Ask about training</ArrowLink>
        </div>
      </section>
    </main>
  );
}

export function CourseDetailPage({ slug }) {
  const state = useLoad(
    () =>
      apiRequest(`/courses/${encodeURIComponent(slug)}`).then((r) => r.data),
    [slug],
  );
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    university: "",
    batch: "",
  });
  const [submit, setSubmit] = useState({
    busy: false,
    error: "",
    errors: {},
    success: "",
  });
  if (state.loading)
    return (
      <main className="wrap page-padded">
        <StateMessage type="loading" title="Loading training program" />
      </main>
    );
  if (state.error)
    return (
      <main className="wrap page-padded">
        <StateMessage
          type="error"
          title="Program not found"
          onRetry={state.retry}
        >
          {state.error}
        </StateMessage>
        <ArrowLink to="/training">Back to training</ArrowLink>
      </main>
    );
  const course = state.data;
  const batches = (course.batches || []).filter(
    (batch) => Number(batch.totalSeats) - Number(batch.seatsTaken) > 0,
  );
  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const send = async (event) => {
    event.preventDefault();
    setSubmit({ busy: true, error: "", errors: {}, success: "" });
    try {
      await apiRequest("/enrollments", {
        method: "POST",
        body: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          university: form.university,
          course: course._id,
          ...(form.batch ? { batch: form.batch } : {}),
        },
      });
      setSubmit({
        busy: false,
        error: "",
        errors: {},
        success:
          "Your enrollment request has been received. We will contact you soon.",
      });
      setForm({ name: "", phone: "", email: "", university: "", batch: "" });
    } catch (error) {
      const errors = Object.fromEntries(
        (error.errors || []).map((item) => [item.field, item.message]),
      );
      setSubmit({
        busy: false,
        error: error.errors?.length ? "" : error.message,
        errors,
        success: "",
      });
    }
  };
  return (
    <main>
      <PageHero
        label="TRAINING PROGRAM / DETAILS"
        title={
          <>
            The foundations of
            <br />
            <em>solar design.</em>
          </>
        }
        description={course.title}
        image={ARCH_IMAGE}
      />
      <section className="course-detail-grid wrap">
        <div className="course-detail-main">
          <Eyebrow number="01">PROGRAM OVERVIEW</Eyebrow>
          <h2>
            Build confidence with <em>industry tools.</em>
          </h2>
          <p>
            This program is listed as online solar design training. Contact ME
            Technologies for confirmed course duration, fee and upcoming batch
            information.
          </p>
          <div className="tools-row">
            {(course.tools || []).map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
          {course.outline?.length > 0 && (
            <div className="outline-list">
              <Eyebrow>WHAT YOU'LL COVER</Eyebrow>
              {course.outline.map((item, i) => (
                <div key={`${item}-${i}`}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          )}
          <div className="course-meta-block">
            <span>Duration</span>
            <strong>{course.duration || "Contact us for details"}</strong>
            <span>Fee</span>
            <strong>
              {typeof course.fee === "number"
                ? `PKR ${course.fee.toLocaleString()}`
                : "Contact us for details"}
            </strong>
            <span>Mode</span>
            <strong>Online</strong>
          </div>
        </div>
        <aside className="form-panel" id="enroll">
          <Eyebrow>ENROLLMENT REQUEST</Eyebrow>
          <h2>Interested in the program?</h2>
          <p>Share your details and the team will contact you.</p>
          {submit.success && (
            <div className="form-success" role="status">
              {submit.success}
            </div>
          )}
          {submit.error && (
            <div className="form-error" role="alert">
              {submit.error}
            </div>
          )}
          <form onSubmit={send} className="site-form">
            {[
              ["name", "Full name", "text"],
              ["phone", "Phone number", "tel"],
              ["email", "Email address", "email"],
              ["university", "University / institute", "text"],
            ].map(([name, label, type]) => (
              <label className="field" key={name}>
                <span>{label} *</span>
                <input
                  required
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={update}
                  minLength={
                    name === "name" || name === "university" ? 2 : undefined
                  }
                />
                {submit.errors[name] && (
                  <small className="field-error">{submit.errors[name]}</small>
                )}
              </label>
            ))}
            <label className="field">
              <span>Upcoming batch (optional)</span>
              <select name="batch" value={form.batch} onChange={update}>
                <option value="">No batch selected / contact me</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {new Date(batch.startDate).toLocaleDateString()} ·{" "}
                    {batch.mode} · {batch.totalSeats - batch.seatsTaken} seats
                    left
                  </option>
                ))}
              </select>
            </label>
            <p className="form-hint">
              Use a supported email provider such as Gmail, iCloud, Outlook,
              Yahoo or Proton.
            </p>
            <button
              className="solid-button"
              type="submit"
              disabled={submit.busy}
            >
              {submit.busy ? "Sending request…" : "Submit enrollment"}{" "}
              <span>↗</span>
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}


function MapPanel({ markers, loading, error }) {
  const [activeCity, setActiveCity] = useState('')

  const grouped = useMemo(() => {
    const map = new Map()

    for (const project of markers || []) {
      const latitude = Number(project.latitude)
      const longitude = Number(project.longitude)

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        continue
      }

      const city = project.city || 'Unknown location'
      const province = project.province || "";
      const key = `${city.toLowerCase()}|${province.toLowerCase()}`;

      if (!map.has(key)) {
        map.set(key, {
          key,
          city,
          province,
          latitude,
          longitude,
          projects: [],
        })
      }

      map.get(key).projects.push(project)
    }

    return [...map.values()]
  }, [markers])

const active =
  grouped.find((item) => item.key === activeCity) || null

  return (
    <div className="map-layout">
      <section
        className="pak-map holo-map"
        aria-label="Holographic map of Pakistan"
      >
        <HolographicPakistanMap
          locations={grouped}
          activeKey={active?.key || ''}
          onLocationSelect={setActiveCity}
        />
      </section>

      <aside className="map-results">
        <Eyebrow>EXPLORE THE MAP</Eyebrow>
        <h3>Project locations</h3>

        {loading ? (
          <StateMessage type="loading" title="Loading locations" />
        ) : error ? (
          <StateMessage type="error" title="Map data unavailable">
            {error}
          </StateMessage>
      ) : grouped.length === 0 ? (
  <StateMessage title="No mapped projects yet">
    Projects with verified coordinates will appear here.
  </StateMessage>
) : !active ? (
  <>
    <p className="body-muted">
      Select a glowing marker to explore projects in that location.
    </p>

    <div className="map-city-list">
      <span className="eyebrow">PROJECT LOCATIONS</span>

      {grouped.map((point) => (
        <button
          type="button"
          key={point.key}
          onClick={() => setActiveCity(point.key)}
        >
          {point.city}
          <span>{point.projects.length}</span>
        </button>
      ))}
    </div>
  </>
) : (
          <>
            <p className="map-city-label">
              {active.city.toUpperCase()}
            </p>

            {active.province && (
              <p className="body-muted">{active.province}</p>
            )}

            <p className="body-muted">
              {active.projects.length}{' '}
              {active.projects.length === 1 ? 'project' : 'projects'} at
              this location.
            </p>

            {active.projects.map((project) => (
              <Link
                className="map-project-link"
                key={project._id}
                to={`/projects/${project.slug}`}
              >
                <span>
                  {project.title}
                  <small>
                    {project.capacity || project.sector}
                  </small>
                </span>
                <b>↗</b>
              </Link>
            ))}

            {grouped.length > 1 && (
              <div className="map-city-list">
                <span className="eyebrow">OTHER LOCATIONS</span>

                {grouped
                  .filter((point) => point.key !== active.key)
                  .map((point) => (
                    <button
                      type="button"
                      key={point.key}
                      onClick={() => setActiveCity(point.key)}
                    >
                      {point.city}
                      <span>{point.projects.length}</span>
                    </button>
                  ))}
              </div>
            )}
          </>
        )}
      </aside>
    </div>
  )
}


export function ProjectsPage() {
  const [filters, setFilters] = useState({
    sector: "",
    systemType: "",
    page: 1,
  });
  const [projects, setProjects] = useState({
    loading: true,
    data: [],
    pagination: null,
    error: "",
  });
  const map = useLoad(
    () =>
      apiRequest(
        `/projects/map${filters.sector ? `?sector=${encodeURIComponent(filters.sector)}` : ""}`,
      ).then((r) => r.data),
    [filters.sector],
  );
  const loadProjects = async () => {
    setProjects((s) => ({ ...s, loading: true, error: "" }));
    const query = new URLSearchParams({
      page: String(filters.page),
      limit: "9",
    });
    if (filters.sector) query.set("sector", filters.sector);
    if (filters.systemType) query.set("systemType", filters.systemType);
    try {
      const r = await apiRequest(`/projects?${query}`);
      setProjects({
        loading: false,
        data: r.data || [],
        pagination: r.pagination || null,
        error: "",
      });
    } catch (error) {
      setProjects({
        loading: false,
        data: [],
        pagination: null,
        error: error.message,
      });
    }
  };
  useEffect(() => {
    loadProjects();
  }, [filters.sector, filters.systemType, filters.page]);
  const filterChange = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  return (
    <main>
      <PageHero
        label="PROJECTS / CASE STUDIES"
        title={
          <>
            Ideas translated
            <br />
            into <em>real systems.</em>
          </>
        }
        description="Explore engineering projects by sector and location, and learn about the problems, solutions and outcomes behind each one."
        image={SOLAR_IMAGE}
      />
      <section className="projects-page wrap">
        <SectionHeading
          eyebrow="PROJECT INDEX"
          title={
            <>
              Every project has
              <br />
              <em>a context.</em>
            </>
          }
          copy="Filter the portfolio to explore the published project information available."
        />
        <div className="filter-bar">
          <label>
            <span>SECTOR</span>
            <select
              value={filters.sector}
              onChange={(e) => filterChange("sector", e.target.value)}
            >
              <option value="">All sectors</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="agriculture">Agriculture</option>
              <option value="ev">EV</option>
            </select>
          </label>
          <label>
            <span>SYSTEM TYPE</span>
            <select
              value={filters.systemType}
              onChange={(e) => filterChange("systemType", e.target.value)}
            >
              <option value="">All systems</option>
              <option value="solar-pv">Solar PV</option>
              <option value="bess">BESS</option>
              <option value="solar-bess">Solar + BESS</option>
              <option value="ev-charging">EV charging</option>
              <option value="electrical-engineering">
                Electrical engineering
              </option>
              <option value="architecture-building-design">
                Architecture / building design
              </option>
              <option value="civil-structural-engineering">
                Civil / structural
              </option>
            </select>
          </label>
          <span className="filter-count">
            {projects.pagination
              ? `${projects.pagination.total} PROJECTS`
              : "PROJECT PORTFOLIO"}
          </span>
        </div>
        {projects.loading ? (
          <StateMessage type="loading" title="Loading projects" />
        ) : projects.error ? (
          <StateMessage
            type="error"
            title="Projects couldn't load"
            onRetry={loadProjects}
          >
            {projects.error}
          </StateMessage>
        ) : projects.data.length ? (
          <div className="project-grid">
            {projects.data.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        ) : (
          <StateMessage title="No published projects match these filters">
            Try another sector or clear the filters. Sample projects are shown
            only when published in the backend.
          </StateMessage>
        )}
        {projects.pagination?.totalPages > 1 && (
          <div className="pagination">
            <button
              type="button"
              disabled={filters.page <= 1}
              onClick={() => setFilters((s) => ({ ...s, page: s.page - 1 }))}
            >
              ← Previous
            </button>
            <span>
              Page {projects.pagination.page} of{" "}
              {projects.pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={filters.page >= projects.pagination.totalPages}
              onClick={() => setFilters((s) => ({ ...s, page: s.page + 1 }))}
            >
              Next →
            </button>
          </div>
        )}
      </section>
      <section className="map-section">
        <div className="wrap">
          <SectionHeading
            eyebrow="PROJECTS ACROSS PAKISTAN"
            title={
              <>
                Where the work <em>happens.</em>
              </>
            }
            copy="Choose a marker to explore the published projects associated with that location."
          />
          <MapPanel
            markers={map.data || []}
            loading={map.loading}
            error={map.error}
          />
        </div>
      </section>
    </main>
  );
}

export function ProjectDetailPage({ slug }) {
  const state = useLoad(
    () =>
      apiRequest(`/projects/${encodeURIComponent(slug)}`).then((r) => r.data),
    [slug],
  );
  if (state.loading)
    return (
      <main className="wrap page-padded">
        <StateMessage type="loading" title="Loading project" />
      </main>
    );
  if (state.error)
    return (
      <main className="wrap page-padded">
        <StateMessage
          type="error"
          title="Project unavailable"
          onRetry={state.retry}
        >
          {state.error}
        </StateMessage>
        <ArrowLink to="/projects">Back to projects</ArrowLink>
      </main>
    );
  const p = state.data;
  return (
    <main>
      <section className="project-detail-hero">
        <div
          className="project-detail-image"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(13,20,15,.92), rgba(13,20,15,.05) 78%), url("${imageUrl(p.coverImage, SOLAR_IMAGE)}")`,
          }}
        />
        <div className="wrap project-detail-title">
          <Eyebrow>PROJECT / {p.sector?.toUpperCase()}</Eyebrow>
          {p.isSample && <span className="sample-pill">SAMPLE PROJECT</span>}
          <h1>{p.title}</h1>
          <div className="project-meta-strip">
            <span>
              {[p.city, p.province].filter(Boolean).join(", ") || "Pakistan"}
            </span>
            <span>{p.capacity || "Capacity not specified"}</span>
            <span>{(p.systemType || "").replaceAll("-", " ")}</span>
          </div>
        </div>
      </section>
      <section className="project-overview wrap">
        <div>
          <Eyebrow number="01">PROJECT OVERVIEW</Eyebrow>
          <h2>
            Context shapes
            <br />
            <em>the solution.</em>
          </h2>
        </div>
        <div>
          <p>
            {p.description ||
              "Further project information has not been added yet."}
          </p>
          <dl className="project-facts">
            <div>
              <dt>Sector</dt>
              <dd>{p.sector || "Not specified"}</dd>
            </div>
            <div>
              <dt>System type</dt>
              <dd>
                {(p.systemType || "").replaceAll("-", " ") || "Not specified"}
              </dd>
            </div>
            <div>
              <dt>Capacity</dt>
              <dd>{p.capacity || "Not specified"}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>
                {[p.city, p.province].filter(Boolean).join(", ") ||
                  "Not specified"}
              </dd>
            </div>
          </dl>
        </div>
      </section>
      {(p.problem || p.solution || p.result) && (
        <section className="case-study-section">
          <div className="wrap">
            <SectionHeading
              eyebrow="CASE STUDY"
              title={
                <>
                  The thinking behind
                  <br />
                  <em>the outcome.</em>
                </>
              }
              copy="Project context, engineering approach and outcome details provided for this case study."
            />
            <div className="case-study-grid">
              {[
                ["01", "The challenge", p.problem],
                ["02", "The solution", p.solution],
                ["03", "The result", p.result],
              ]
                .filter((item) => item[2])
                .map(([num, title, text]) => (
                  <article key={num}>
                    <span>{num}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
            </div>
          </div>
        </section>
      )}
      {p.images?.length > 0 && (
        <section className="project-gallery-section wrap">
          <Eyebrow>PROJECT GALLERY</Eyebrow>
          <div className="project-gallery">
            {p.images.map((src, i) => (
              <div
                className={i === 0 ? "gallery-large" : ""}
                key={`${src}-${i}`}
              >
                <ImageFrame
                  src={src}
                  alt={`${p.title} — gallery image ${i + 1}`}
                  fallback={SOLAR_IMAGE}
                />
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="cta-strip wrap">
        <div>
          <Eyebrow>HAVE A SIMILAR CHALLENGE?</Eyebrow>
          <h2>Let's explore the right approach.</h2>
        </div>
        <ArrowLink to="/quote">Discuss your project</ArrowLink>
      </section>
    </main>
  );
}

export function BlogPage() {
  const [filters, setFilters] = useState({ search: "", category: "", page: 1 });
  const [state, setState] = useState({
    loading: true,
    data: [],
    pagination: null,
    error: "",
  });
  const load = async () => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    const q = new URLSearchParams({ page: String(filters.page), limit: "9" });
    if (filters.search) q.set("search", filters.search);
    if (filters.category) q.set("category", filters.category);
    try {
      const r = await apiRequest(`/posts?${q}`);
      setState({
        loading: false,
        data: r.data || [],
        pagination: r.pagination || null,
        error: "",
      });
    } catch (e) {
      setState({
        loading: false,
        data: [],
        pagination: null,
        error: e.message,
      });
    }
  };
  useEffect(() => {
    const id = setTimeout(load, 250);
    return () => clearTimeout(id);
  }, [filters.search, filters.category, filters.page]);
  return (
    <main>
      <PageHero
        label="JOURNAL / INSIGHTS"
        title={
          <>
            A clearer view
            <br />
            of what's <em>next.</em>
          </>
        }
        description="Articles and perspectives on engineering, renewable energy and technical learning."
        image={ARCH_IMAGE}
      />
      <section className="journal-page wrap">
        <SectionHeading
          eyebrow="THE JOURNAL"
          title={
            <>
              Ideas for a changing
              <br />
              <em>energy landscape.</em>
            </>
          }
        />
        <div className="filter-bar blog-filters">
          <label className="search-field">
            <span>SEARCH ARTICLES</span>
            <input
              value={filters.search}
              onChange={(e) =>
                setFilters((s) => ({ ...s, search: e.target.value, page: 1 }))
              }
              placeholder="Search by title or keyword…"
            />
          </label>
          <label>
            <span>CATEGORY</span>
            <input
              value={filters.category}
              onChange={(e) =>
                setFilters((s) => ({ ...s, category: e.target.value, page: 1 }))
              }
              placeholder="All categories"
            />
          </label>
        </div>
        {state.loading ? (
          <StateMessage type="loading" title="Loading articles" />
        ) : state.error ? (
          <StateMessage
            type="error"
            title="Articles couldn't load"
            onRetry={load}
          >
            {state.error}
          </StateMessage>
        ) : state.data.length ? (
          <div className="article-grid">
            {state.data.map((p) => (
              <ArticleCard key={p._id} post={p} />
            ))}
          </div>
        ) : (
          <StateMessage title="No published articles found">
            Try another search or category. New articles will appear here once
            published.
          </StateMessage>
        )}
        {state.pagination?.totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={filters.page <= 1}
              onClick={() => setFilters((s) => ({ ...s, page: s.page - 1 }))}
            >
              ← Previous
            </button>
            <span>
              Page {state.pagination.page} of {state.pagination.totalPages}
            </span>
            <button
              disabled={filters.page >= state.pagination.totalPages}
              onClick={() => setFilters((s) => ({ ...s, page: s.page + 1 }))}
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export function BlogDetailPage({ slug }) {
  const state = useLoad(
    () => apiRequest(`/posts/${encodeURIComponent(slug)}`).then((r) => r.data),
    [slug],
  );
  if (state.loading)
    return (
      <main className="wrap page-padded">
        <StateMessage type="loading" title="Loading article" />
      </main>
    );
  if (state.error)
    return (
      <main className="wrap page-padded">
        <StateMessage
          type="error"
          title="Article unavailable"
          onRetry={state.retry}
        >
          {state.error}
        </StateMessage>
        <ArrowLink to="/blog">Back to journal</ArrowLink>
      </main>
    );
  const post = state.data;
  return (
    <main>
      <section className="article-detail-hero">
        <div
          className="article-detail-image"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(13,20,15,.92), rgba(13,20,15,.1) 80%), url("${imageUrl(post.coverImage, ARCH_IMAGE)}")`,
          }}
        />
        <div className="wrap article-detail-title">
          <Eyebrow>
            {post.category || "ME JOURNAL"}
            {post.publishedAt &&
              ` / ${new Date(post.publishedAt).toLocaleDateString()}`}
          </Eyebrow>
          <h1>{post.title}</h1>
        </div>
      </section>
      <article className="article-content wrap">
        <Link to="/blog" className="back-link">
          ← Back to journal
        </Link>
        {post.content
          .split(/\n+/)
          .filter(Boolean)
          .map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
      </article>
      <section className="cta-strip wrap">
        <div>
          <Eyebrow>KEEP THE CONVERSATION GOING</Eyebrow>
          <h2>Questions about a topic?</h2>
        </div>
        <ArrowLink to="/contact">Get in touch</ArrowLink>
      </section>
    </main>
  );
}

export function LeadFormPage({ source = "contact" }) {
  const isQuote = source === "quote";
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    service: "",
    message: "",
    source,
  });
  const [submit, setSubmit] = useState({
    busy: false,
    error: "",
    errors: {},
    success: "",
  });
  const [services, setServices] = useState([]);
  useEffect(() => {
    apiRequest("/services")
      .then((r) => setServices(r.data || []))
      .catch(() => setServices([]));
  }, []);
  const update = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  const send = async (event) => {
    event.preventDefault();
    setSubmit({ busy: true, error: "", errors: {}, success: "" });
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        city: form.city || undefined,
        service: form.service || undefined,
        message: form.message,
        source,
      };
      const r = await apiRequest("/leads", { method: "POST", body: payload });
      setSubmit({
        busy: false,
        error: "",
        errors: {},
        success: r.message || "Thank you. Your message has been received.",
      });
      setForm({
        name: "",
        phone: "",
        email: "",
        city: "",
        service: "",
        message: "",
        source,
      });
    } catch (error) {
      setSubmit({
        busy: false,
        error: error.errors?.length ? "" : error.message,
        errors: Object.fromEntries(
          (error.errors || []).map((item) => [item.field, item.message]),
        ),
        success: "",
      });
    }
  };
  return (
    <main>
      <PageHero
        label={isQuote ? "PROJECT ENQUIRY" : "CONTACT ME TECHNOLOGIES"}
        title={
          isQuote ? (
            <>
              Let's scope the
              <br />
              <em>right solution.</em>
            </>
          ) : (
            <>
              Start with a<br />
              <em>conversation.</em>
            </>
          )
        }
        description={
          isQuote
            ? "Tell us a little about the project or challenge you have in mind."
            : "Have a question about engineering, energy solutions or training? Tell us how we can help."
        }
        image={isQuote ? SOLAR_IMAGE : ARCH_IMAGE}
      />
      <section className="contact-page wrap">
        <div className="contact-copy">
          <Eyebrow number="01">GET IN TOUCH</Eyebrow>
          <h2>
            Good work begins with <em>a conversation.</em>
          </h2>
          <p>
            Share the essentials and the team can follow up with you. Required
            fields are marked clearly; please use a supported email address.
          </p>
          <div className="contact-detail">
            <span>PHONE / WHATSAPP</span>
            <a href="tel:03166379325">0316 6379325 ↗</a>
          </div>
          <div className="contact-detail">
            <span>BUSINESS ENQUIRIES</span>
            <Link to="/quote">Request a project quote ↗</Link>
          </div>
          <div className="contact-detail">
            <span>TRAINING ENQUIRIES</span>
            <Link to="/training">Explore training programs ↗</Link>
          </div>
        </div>
        <div className="form-panel contact-form-panel">
          <Eyebrow>{isQuote ? "PROJECT DETAILS" : "YOUR MESSAGE"}</Eyebrow>
          <h2>
            {isQuote ? "Tell us about the project." : "What can we help with?"}
          </h2>
          {submit.success && (
            <div className="form-success" role="status">
              {submit.success}
            </div>
          )}
          {submit.error && (
            <div className="form-error" role="alert">
              {submit.error}
            </div>
          )}
          <form onSubmit={send} className="site-form">
            <div className="form-two-col">
              <label className="field">
                <span>Full name *</span>
                <input
                  name="name"
                  required
                  minLength="2"
                  maxLength="100"
                  value={form.name}
                  onChange={update}
                />
                {submit.errors.name && (
                  <small className="field-error">{submit.errors.name}</small>
                )}
              </label>
              <label className="field">
                <span>Phone number *</span>
                <input
                  name="phone"
                  required
                  type="tel"
                  minLength="7"
                  maxLength="20"
                  value={form.phone}
                  onChange={update}
                  placeholder="+92…"
                />
                {submit.errors.phone && (
                  <small className="field-error">{submit.errors.phone}</small>
                )}
              </label>
            </div>
            <label className="field">
              <span>Email address *</span>
              <input
                name="email"
                required
                type="email"
                value={form.email}
                onChange={update}
              />
              {submit.errors.email && (
                <small className="field-error">{submit.errors.email}</small>
              )}
              <small className="field-hint">
                Use Gmail, iCloud, Outlook, Yahoo or Proton.
              </small>
            </label>
            <div className="form-two-col">
              <label className="field">
                <span>City</span>
                <input
                  name="city"
                  maxLength="100"
                  value={form.city}
                  onChange={update}
                  placeholder="e.g. Islamabad"
                />
                {submit.errors.city && (
                  <small className="field-error">{submit.errors.city}</small>
                )}
              </label>
              <label className="field">
                <span>Area of interest</span>
                <select name="service" value={form.service} onChange={update}>
                  <option value="">Choose a service (optional)</option>
                  {services.map((s) => (
                    <option key={s._id} value={isQuote ? s.slug : s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
                {submit.errors.service && (
                  <small className="field-error">{submit.errors.service}</small>
                )}
              </label>
            </div>
            <label className="field">
              <span>
                {isQuote ? "Tell us about your project *" : "Your message *"}
              </span>
              <textarea
                name="message"
                required
                minLength="10"
                maxLength="2000"
                rows="5"
                value={form.message}
                onChange={update}
                placeholder={
                  isQuote
                    ? "What are you planning, where is it, and what would you like to achieve?"
                    : "Write a few details so we can direct your enquiry."
                }
              />
              {submit.errors.message && (
                <small className="field-error">{submit.errors.message}</small>
              )}
            </label>
            <button
              className="solid-button"
              disabled={submit.busy}
              type="submit"
            >
              {submit.busy
                ? "Sending…"
                : isQuote
                  ? "Send project enquiry"
                  : "Send message"}{" "}
              <span>↗</span>
            </button>
          </form>
        </div>
      </section>
      <section className="contact-map-placeholder wrap">
        <div>
          <span className="eyebrow">ME TECHNOLOGIES / PAKISTAN</span>
          <p>
            For direct assistance, contact us by phone or WhatsApp at{" "}
            <strong>0316 6379325</strong>.
          </p>
        </div>
        <span className="contact-coordinate">
          33.6844° N<br />
          73.0479° E
        </span>
      </section>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main className="not-found wrap">
      <Eyebrow>404 / PAGE NOT FOUND</Eyebrow>
      <h1>
        That path doesn't
        <br />
        <em>lead anywhere.</em>
      </h1>
      <p>The page may have moved or the address may be incorrect.</p>
      <ArrowLink to="/">Return to homepage</ArrowLink>
    </main>
  );
}
