/* eslint react-hooks/set-state-in-effect: off, react-hooks/exhaustive-deps: off */
import { useEffect, useState } from "react";
import { Link, useRouter } from "../router";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Eyebrow, StateMessage } from "../components/UI";

const adminNav = [
  ["Overview", "/admin"],
  ["Leads", "/admin/leads"],
  ["Enrollments", "/admin/enrollments"],
  ["Services", "/admin/services"],
  ["Courses", "/admin/courses"],
  ["Batches", "/admin/batches"],
  ["Projects", "/admin/projects"],
  ["Blog posts", "/admin/posts"],
];

export function AdminShell({ children, title, eyebrow = "WORKSPACE" }) {
  const { path, navigate } = useRouter();
  const { user, logout } = useAuth();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <img src="/assets/brand/logo-mark.png" alt="" />
          <span>
            ME <b>TECHNOLOGIES</b>
            <small>ADMIN WORKSPACE</small>
          </span>
        </Link>
        <div className="admin-side-label">MANAGE</div>
        <nav>
          {adminNav.map(([label, href]) => (
            <Link
              key={href}
              to={href}
              className={
                (
                  href === "/admin"
                    ? path.split("?")[0] === href
                    : path.startsWith(href)
                )
                  ? "active"
                  : ""
              }
            >
              <span className="admin-nav-dot" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="admin-side-bottom">
          <span>{user?.name || user?.email || "Administrator"}</span>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/admin/login");
            }}
          >
            Log out ↗
          </button>
          <Link to="/">← View website</Link>
        </div>
      </aside>
      <div className="admin-main">
        
<header className="admin-topbar">
  <span>
    ME TECHNOLOGIES <i>/</i> ADMIN
  </span>

  <div className="admin-topbar-actions">
    <span className="admin-user">
      {user?.name || user?.email || 'Administrator'}
    </span>

    <button
      type="button"
      className="admin-mobile-logout"
      onClick={() => {
        logout()
        navigate('/admin/login')
      }}
    >
      Log out ↗
    </button>
  </div>
</header>

        <main className="admin-content">
          <div className="admin-title">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1>{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminLoginPage() {
  const { login, isAuthenticated, checking } = useAuth();
  const { navigate } = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [state, setState] = useState({ busy: false, error: "", errors: {} });
  useEffect(() => {
    if (isAuthenticated) navigate("/admin", { replace: true });
  }, [isAuthenticated, navigate]);
  const submit = async (event) => {
    event.preventDefault();
    setState({ busy: true, error: "", errors: {} });
    try {
      await login(form.email, form.password);
      navigate("/admin", { replace: true });
    } catch (error) {
      setState({
        busy: false,
        error: error.message,
        errors: Object.fromEntries(
          (error.errors || []).map((e) => [e.field, e.message]),
        ),
      });
      return;
    }
    setState({ busy: false, error: "", errors: {} });
  };
  if (checking)
    return (
      <main className="admin-login-page">
        <StateMessage type="loading" title="Checking your session" />
      </main>
    );
  return (
    <main className="admin-login-page">
      <Link to="/" className="login-back">
        ← Return to website
      </Link>
      <section className="login-card">
        <img src="/assets/brand/logo-mark.png" alt="ME Technologies" />
        <Eyebrow>ADMINISTRATOR ACCESS</Eyebrow>
        <h1>
          Welcome <em>back.</em>
        </h1>
        <p>
          Sign in with your seeded administrator account to manage site content
          and enquiries.
        </p>
        {state.error && (
          <div className="form-error" role="alert">
            {state.error}
          </div>
        )}
        <form className="site-form" onSubmit={submit}>
          <label className="field">
            <span>Email address</span>
            <input
              type="email"
              autoComplete="username"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {state.errors.email && (
              <small className="field-error">{state.errors.email}</small>
            )}
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {state.errors.password && (
              <small className="field-error">{state.errors.password}</small>
            )}
          </label>
          <button className="solid-button" type="submit" disabled={state.busy}>
            {state.busy ? "Signing in…" : "Sign in to dashboard"} <span>↗</span>
          </button>
        </form>
        <span className="login-note">
          Administrator accounts are created by the project seed script. Public
          registration is disabled.
        </span>
      </section>
    </main>
  );
}

export function AdminDashboardPage() {
  const [state, setState] = useState({ loading: true, data: null, error: "" });
  const load = () => {
    setState({ loading: true, data: null, error: "" });
    apiRequest("/admin/dashboard")
      .then((r) => setState({ loading: false, data: r.data, error: "" }))
      .catch((e) => setState({ loading: false, data: null, error: e.message }));
  };
  useEffect(() => {
    load();
  }, []);
  const d = state.data;
  const stats = d
    ? [
        [
          "New leads",
          d.leads?.new ?? 0,
          `${d.leads?.total ?? 0} total enquiries`,
          "/admin/leads",
        ],
        [
          "Pending enrollments",
          d.enrollments?.pending ?? 0,
          `${d.enrollments?.total ?? 0} total requests`,
          "/admin/enrollments",
        ],
        [
          "Published posts & drafts",
          d.posts?.total ?? 0,
          "Manage the journal",
          "/admin/posts",
        ],
        [
          "Projects",
          d.projects?.total ?? 0,
          "Manage the portfolio",
          "/admin/projects",
        ],
      ]
    : [];
  return (
    <AdminShell title="Overview" eyebrow="DASHBOARD">
      <div className="admin-welcome">
        <div>
          <span>GOOD WORK STARTS HERE</span>
          <h2>Clear view. Better decisions.</h2>
          <p>
            Manage enquiries, training requests and published content in one
            place.
          </p>
        </div>
        <span className="admin-welcome-mark">ME</span>
      </div>
      {state.loading ? (
        <StateMessage type="loading" title="Loading dashboard" />
      ) : state.error ? (
        <StateMessage
          type="error"
          title="Dashboard couldn't load"
          onRetry={load}
        >
          {state.error}
        </StateMessage>
      ) : (
        <>
          <div className="admin-stat-grid">
            {stats.map(([title, value, detail, to]) => (
              <Link key={title} to={to} className="admin-stat">
                <span>{title}</span>
                <strong>{value}</strong>
                <small>{detail}</small>
                <b>↗</b>
              </Link>
            ))}
          </div>
          <div className="admin-shortcuts">
            <div>
              <Eyebrow>CONTENT</Eyebrow>
              <h3>Keep the website current.</h3>
              <p>
                Published content appears on the public website. Draft posts and
                unpublished projects remain manageable here.
              </p>
            </div>
            <div className="shortcut-links">
              {[
                ["Manage projects", "/admin/projects"],
                ["Manage services", "/admin/services"],
                ["Manage courses", "/admin/courses"],
                ["Manage blog posts", "/admin/posts"],
              ].map(([label, to]) => (
                <Link key={to} to={to}>
                  {label}
                  <span>↗</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}

const listConfigs = {
  leads: {
    title: "Leads",
    endpoint: "/leads",
    columns: ["name", "email", "phone", "city", "service", "source", "status"],
    statuses: ["new", "contacted", "quoted", "closed"],
  },
  enrollments: {
    title: "Enrollments",
    endpoint: "/enrollments",
    columns: [
      "name",
      "email",
      "phone",
      "university",
      "course",
      "batch",
      "status",
    ],
    statuses: ["pending", "confirmed", "cancelled"],
  },
};

export function AdminInboxPage({ kind }) {
  const config = listConfigs[kind];
  const [filters, setFilters] = useState({ search: "", status: "", page: 1 });
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
    if (filters.status) q.set("status", filters.status);
    try {
      const r = await apiRequest(`${config.endpoint}?${q}`);
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
    load();
  }, [filters.search, filters.status, filters.page]);
  const patchStatus = async (item, status) => {
    try {
      await apiRequest(`${config.endpoint}/${item._id}/status`, {
        method: "PATCH",
        body: { status },
      });
      load();
    } catch (error) {
      window.alert(error.message);
    }
  };
  const deleteItem = async (item) => {
    if (
      !window.confirm(
        `Delete ${item.name || "this record"}? This cannot be undone.`,
      )
    )
      return;
    try {
      await apiRequest(`${config.endpoint}/${item._id}`, { method: "DELETE" });
      load();
    } catch (error) {
      window.alert(error.message);
    }
  };
  return (
    <AdminShell
      title={config.title}
      eyebrow={`INBOX / ${config.title.toUpperCase()}`}
    >
      <div className="admin-toolbar">
        <label className="admin-search">
          <span>⌕</span>
          <input
            value={filters.search}
            onChange={(e) =>
              setFilters((s) => ({ ...s, search: e.target.value, page: 1 }))
            }
            placeholder="Search records…"
          />
        </label>
        <label className="admin-select">
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((s) => ({ ...s, status: e.target.value, page: 1 }))
            }
          >
            <option value="">All statuses</option>
            {config.statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <button type="button" className="admin-outline-button" onClick={load}>
          Refresh ↻
        </button>
      </div>
      {state.loading ? (
        <StateMessage
          type="loading"
          title={`Loading ${config.title.toLowerCase()}`}
        />
      ) : state.error ? (
        <StateMessage
          type="error"
          title={`${config.title} couldn't load`}
          onRetry={load}
        >
          {state.error}
        </StateMessage>
      ) : state.data.length ? (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {config.columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.data.map((item) => (
                <tr key={item._id}>
                  {config.columns.map((column) => (
                    <td key={column}>
                      {column === "course" ? (
                        item.course?.title || "—"
                      ) : column === "batch" ? (
                        item.batch ? (
                          new Date(item.batch.startDate).toLocaleDateString()
                        ) : (
                          "—"
                        )
                      ) : column === "status" ? (
                        <span className={`status-chip status-${item.status}`}>
                          {item.status}
                        </span>
                      ) : (
                        item[column] || "—"
                      )}
                    </td>
                  ))}
                  <td className="table-actions">
                    <select
                      aria-label={`Change status for ${item.name}`}
                      value={item.status}
                      onChange={(e) => patchStatus(item, e.target.value)}
                    >
                      {config.statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => deleteItem(item)}
                      aria-label={`Delete ${item.name}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <StateMessage title={`No ${config.title.toLowerCase()} found`}>
          New submissions will appear here when people use the public forms.
        </StateMessage>
      )}
      {state.pagination && (
        <div className="pagination admin-pagination">
          <button
            disabled={filters.page <= 1}
            onClick={() => setFilters((s) => ({ ...s, page: s.page - 1 }))}
          >
            ← Previous
          </button>
          <span>
            Page {state.pagination.page} of {state.pagination.totalPages} ·{" "}
            {state.pagination.total} records
          </span>
          <button
            disabled={filters.page >= state.pagination.totalPages}
            onClick={() => setFilters((s) => ({ ...s, page: s.page + 1 }))}
          >
            Next →
          </button>
        </div>
      )}
    </AdminShell>
  );
}

const resourceConfigs = {
  services: {
    title: "Services",
    publicEndpoint: "/services",
    adminEndpoint: "/services",
    fields: [
      ["title", "Title", "text", true],
      ["slug", "Slug", "text", true],
      ["icon", "Icon identifier", "text", false],
      ["shortText", "Short text", "text", true],
      ["description", "Description", "textarea", false],
      ["order", "Display order", "number", false],
    ],
  },
  courses: {
    title: "Courses",
    publicEndpoint: "/courses",
    adminEndpoint: "/courses",
    fields: [
      ["title", "Title", "text", true],
      ["slug", "Slug", "text", true],
      ["tools", "Tools (comma separated)", "array", false],
      ["duration", "Duration", "text", false],
      ["fee", "Fee (PKR)", "number", false],
      ["outline", "Outline (one item per line)", "lines", false],
      ["image", "Image URL or /uploads path", "text", false],
    ],
  },
  batches: {
    title: "Batches",
    publicEndpoint: "/batches",
    adminEndpoint: "/batches",
    fields: [
      ["course", "Course", "course", true],
      ["startDate", "Start date", "date", true],
      ["mode", "Mode", "select:online,onsite", true],
      ["totalSeats", "Total seats", "number", true],
    ],
  },
  projects: {
    title: "Projects",
    publicEndpoint: "/projects",
    adminEndpoint: "/projects/admin/all",
    fields: [
      ["title", "Title", "text", true],
      ["slug", "Slug", "text", true],
      ["coverImage", "Cover image URL or /uploads path", "text", false],
      ["images", "Gallery image paths (one per line)", "lines", false],
      ["capacityValue", "Capacity value", "number", false],
      ["capacityUnit", "Capacity unit", "select:kW,MW,kWh,MWh", false],
      [
        "sector",
        "Sector",
        "select:residential,commercial,industrial,agriculture,ev",
        true,
      ],
      [
        "systemType",
        "System type",
        "select:solar-pv,bess,solar-bess,ev-charging,electrical-engineering,architecture-building-design,civil-structural-engineering",
        false,
      ],
      ["city", "City", "text", false],
      ["province", "Province", "text", false],
      ["latitude", "Latitude (Pakistan)", "number", false],
      ["longitude", "Longitude (Pakistan)", "number", false],
      ["description", "Description", "textarea", false],
      ["problem", "Case study: problem", "textarea", false],
      ["solution", "Case study: solution", "textarea", false],
      ["result", "Case study: result", "textarea", false],
      ["isSample", "Sample project?", "boolean", false],
      ["isPublished", "Published?", "boolean", false],
    ],
  },
  posts: {
    title: "Blog posts",
    publicEndpoint: "/posts",
    adminEndpoint: "/posts/admin/all",
    fields: [
      ["title", "Title", "text", true],
      ["slug", "Slug", "text", true],
      ["category", "Category", "text", false],
      ["coverImage", "Cover image URL or /uploads path", "text", false],
      ["content", "Content", "textarea", true],
      ["isPublished", "Published?", "boolean", false],
    ],
  },
};

function initialValue(entry, field, type, kind) {
  if (!entry)
    return type === "boolean"
      ? field === "isSample" || (field === "isPublished" && kind !== "posts")
      : "";
  const value = entry[field];
  if (type === "array") return Array.isArray(value) ? value.join(", ") : "";
  if (type === "lines") return Array.isArray(value) ? value.join("\n") : "";
  if (type === "boolean") return Boolean(value);
  if (type === "date" && value) return String(value).slice(0, 10);
  if (field === "course" && value && typeof value === "object")
    return value._id;
  return value ?? "";
}

function ResourceEditor({ kind, entry, onClose, onSaved }) {
  const config = resourceConfigs[kind];
  const [form, setForm] = useState(() =>
    Object.fromEntries(
      config.fields.map(([name, , type]) => [
        name,
        initialValue(entry, name, type.split(":")[0], kind),
      ]),
    ),
  );
  const [courses, setCourses] = useState([]);
  const [state, setState] = useState({ busy: false, error: "", errors: {} });
  useEffect(() => {
    if (kind === "batches")
      apiRequest("/courses")
        .then((r) => setCourses(r.data || []))
        .catch(() => setCourses([]));
  }, [kind]);
  const update = (name, value) => setForm((s) => ({ ...s, [name]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setState({ busy: true, error: "", errors: {} });
    const payload = {};
    for (const [name, , rawType] of config.fields) {
      const type = rawType.split(":")[0];
      let value = form[name];
      if (type === "array")
        value = value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      else if (type === "lines")
        value = value
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      else if (type === "number")
        value = value === "" ? undefined : Number(value);
      else if (type === "boolean") value = Boolean(value);
      else if (
        type === "select" &&
        name === "capacityUnit" &&
        !form.capacityValue
      )
        value = undefined;
      else if (
        value === "" &&
        ["fee", "order", "latitude", "longitude", "capacityValue"].includes(
          name,
        )
      )
        value = undefined;
      payload[name] = value;
    }
    if (kind === "projects") {
      payload.capacityUnit =
        form.capacityValue === "" ? undefined : form.capacityUnit || undefined;
      if (form.latitude === "" && form.longitude === "") {
        payload.latitude = null;
        payload.longitude = null;
      } else {
        payload.latitude =
          form.latitude === "" ? undefined : Number(form.latitude);
        payload.longitude =
          form.longitude === "" ? undefined : Number(form.longitude);
      }
      if (form.capacityValue === "") {
        delete payload.capacityValue;
        delete payload.capacityUnit;
      }
    }
    if (kind === "courses" && form.fee === "") delete payload.fee;
    for (const key of [
      "icon",
      "description",
      "duration",
      "image",
      "category",
      "coverImage",
      "city",
      "province",
      "problem",
      "solution",
      "result",
      "systemType",
      "capacityUnit",
    ])
      if (payload[key] === "") payload[key] = undefined;
    try {
      const r = await apiRequest(entry ? `/${kind}/${entry._id}` : `/${kind}`, {
        method: entry ? "PUT" : "POST",
        body: payload,
      });
      setState({ busy: false, error: "", errors: {} });
      onSaved(r.message || `${config.title} saved.`);
    } catch (error) {
      setState({
        busy: false,
        error: error.errors?.length ? "" : error.message,
        errors: Object.fromEntries(
          (error.errors || []).map((item) => [item.field, item.message]),
        ),
      });
    }
  };
  const upload = async (name, file) => {
    if (!file) return;
    setState((s) => ({ ...s, error: "", busy: true }));
    const data = new FormData();
    data.append("image", file);
    try {
      const r = await apiRequest("/uploads", { method: "POST", body: data });
      update(name, r.data.url);
      setState((s) => ({ ...s, busy: false }));
    } catch (e) {
      setState((s) => ({ ...s, busy: false, error: e.message }));
    }
  };
  return (
    <div
      className="editor-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="editor-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`${entry ? "Edit" : "Create"} ${config.title}`}
      >
        <div className="editor-heading">
          <div>
            <Eyebrow>{entry ? "UPDATE RECORD" : "NEW RECORD"}</Eyebrow>
            <h2>
              {entry ? "Edit" : "Create"}{" "}
              {config.title.toLowerCase().replace(/s$/, "")}
            </h2>
          </div>
          <button
            className="editor-close"
            type="button"
            onClick={onClose}
            aria-label="Close editor"
          >
            ×
          </button>
        </div>
        {state.error && (
          <div className="form-error" role="alert">
            {state.error}
          </div>
        )}
        <form className="site-form editor-form" onSubmit={submit}>
          <div className="editor-fields">
            {config.fields.map(([name, label, rawType, required]) => {
              const type = rawType.split(":")[0];
              return (
                <label
                  className={`field ${type === "textarea" || type === "lines" ? "field-wide" : ""}`}
                  key={name}
                >
                  <span>
                    {label}
                    {required ? " *" : ""}
                  </span>
                  {type === "textarea" || type === "lines" ? (
                    <textarea
                      required={required}
                      rows={type === "lines" ? 3 : 4}
                      value={form[name] ?? ""}
                      onChange={(e) => update(name, e.target.value)}
                    />
                  ) : type === "boolean" ? (
                    <select
                      value={String(Boolean(form[name]))}
                      onChange={(e) => update(name, e.target.value === "true")}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : type === "course" ? (
                    <select
                      required
                      value={form.course || ""}
                      onChange={(e) => update(name, e.target.value)}
                    >
                      <option value="">Select course</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  ) : type === "select" ? (
                    <select
                      required={required}
                      value={form[name] || ""}
                      onChange={(e) => update(name, e.target.value)}
                    >
                      <option value="">Select…</option>
                      {rawType
                        .split(":")[1]
                        .split(",")
                        .map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <>
                      <input
                        required={required}
                        type={type === "number" ? "number" : type}
                        step={type === "number" ? "any" : undefined}
                        min={
                          type === "number" &&
                          [
                            "capacityValue",
                            "totalSeats",
                            "order",
                            "fee",
                          ].includes(name)
                            ? "0"
                            : undefined
                        }
                        value={form[name] ?? ""}
                        onChange={(e) => update(name, e.target.value)}
                      />
                      {["coverImage", "image"].includes(name) && (
                        <span className="upload-control">
                          Or upload an image:{" "}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => upload(name, e.target.files?.[0])}
                          />
                        </span>
                      )}
                    </>
                  )}
                  {state.errors[name] && (
                    <small className="field-error">{state.errors[name]}</small>
                  )}
                </label>
              );
            })}
          </div>
          <div className="editor-actions">
            <button
              type="button"
              className="admin-outline-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="solid-button"
              type="submit"
              disabled={state.busy}
            >
              {state.busy
                ? "Saving…"
                : entry
                  ? "Save changes"
                  : "Create record"}{" "}
              <span>↗</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export function AdminContentPage({ kind }) {
  const config = resourceConfigs[kind];
  const [state, setState] = useState({
    loading: true,
    data: [],
    pagination: null,
    error: "",
  });
  const [editor, setEditor] = useState(null);
  const [notice, setNotice] = useState("");
  const [filters, setFilters] = useState({ search: "", page: 1 });
  const load = async () => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    const q = new URLSearchParams({ page: String(filters.page), limit: "9" });
    if (filters.search) q.set("search", filters.search);
    try {
      const endpoint =
        kind === "projects"
          ? `/projects/admin/all?${q}`
          : kind === "posts"
            ? `/posts/admin/all?${q}`
            : kind === "batches"
              ? "/batches"
              : kind === "services"
                ? "/services"
                : kind === "courses"
                  ? "/courses"
                  : config.adminEndpoint;
      const r = await apiRequest(endpoint);
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
    load();
  }, [kind, filters.search, filters.page]);
  const deleteItem = async (entry) => {
    if (
      !window.confirm(
        `Delete “${entry.title || entry.name}”? This cannot be undone.`,
      )
    )
      return;
    try {
      await apiRequest(`/${kind}/${entry._id}`, { method: "DELETE" });
      setNotice("Record deleted.");
      load();
    } catch (e) {
      window.alert(e.message);
    }
  };
  const displayColumns =
    kind === "services"
      ? ["title", "slug", "order"]
      : kind === "courses"
        ? ["title", "slug", "duration", "fee"]
        : kind === "batches"
          ? ["course", "startDate", "mode", "totalSeats", "seatsTaken"]
          : kind === "projects"
            ? ["title", "city", "sector", "capacity", "isPublished", "isSample"]
            : ["title", "category", "publishedAt", "isPublished"];
  const valueFor = (entry, key) =>
    key === "course"
      ? entry.course?.title || String(entry.course || "—")
      : key === "fee"
        ? typeof entry.fee === "number"
          ? `PKR ${entry.fee}`
          : "—"
        : key === "startDate" || key === "publishedAt"
          ? entry[key]
            ? new Date(entry[key]).toLocaleDateString()
            : "—"
          : key === "isPublished" || key === "isSample"
            ? entry[key]
              ? "Yes"
              : "No"
            : entry[key] || "—";
  return (
    <AdminShell title={config.title} eyebrow="CONTENT MANAGEMENT">
      <div className="admin-toolbar">
        <label className="admin-search">
          <span>⌕</span>
          <input
            value={filters.search}
            onChange={(e) =>
              setFilters((s) => ({ ...s, search: e.target.value, page: 1 }))
            }
            placeholder={`Search ${config.title.toLowerCase()}…`}
          />
        </label>
        <button type="button" className="admin-outline-button" onClick={load}>
          Refresh ↻
        </button>
        <button
          type="button"
          className="solid-button admin-add-button"
          onClick={() => {
            setNotice("");
            setEditor(null);
            setEditor({ entry: null });
          }}
        >
          + Add {config.title.replace(/s$/, "")}
        </button>
      </div>
      {notice && (
        <div className="form-success" role="status">
          {notice}
        </div>
      )}
      {state.loading ? (
        <StateMessage
          type="loading"
          title={`Loading ${config.title.toLowerCase()}`}
        />
      ) : state.error ? (
        <StateMessage
          type="error"
          title={`Couldn't load ${config.title.toLowerCase()}`}
          onRetry={load}
        >
          {state.error}
        </StateMessage>
      ) : state.data.length ? (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {displayColumns.map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.data.map((entry) => (
                <tr key={entry._id}>
                  {displayColumns.map((key) => (
                    <td key={key}>{valueFor(entry, key)}</td>
                  ))}
                  <td className="table-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setNotice("");
                        setEditor({ entry });
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" onClick={() => deleteItem(entry)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <StateMessage title={`No ${config.title.toLowerCase()} yet`}>
          Create your first record to make it available to the website.
        </StateMessage>
      )}
      {state.pagination && state.pagination.totalPages > 1 && (
        <div className="pagination admin-pagination">
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
      {editor && (
        <ResourceEditor
          kind={kind}
          entry={editor.entry}
          onClose={() => setEditor(null)}
          onSaved={(message) => {
            setEditor(null);
            setNotice(message);
            load();
          }}
        />
      )}
    </AdminShell>
  );
}

export function ProtectedAdmin({ children }) {
  const { isAuthenticated, checking } = useAuth();
  const { navigate } = useRouter();
  useEffect(() => {
    if (!checking && !isAuthenticated)
      navigate("/admin/login", { replace: true });
  }, [checking, isAuthenticated, navigate]);
  if (checking || !isAuthenticated)
    return (
      <main className="admin-login-page">
        <StateMessage type="loading" title="Checking admin access" />
      </main>
    );
  return children;
}
