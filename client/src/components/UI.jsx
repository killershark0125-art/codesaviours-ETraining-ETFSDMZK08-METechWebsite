import { Link } from '../router'
import { imageUrl } from '../utils/imageUrl'

export function Eyebrow({ children, number }) { return <p className="eyebrow">{number && <span className="eyebrow-num">{number}</span>}<span className="eyebrow-rule" />{children}</p> }
export function SectionHeading({ number, eyebrow, title, copy, dark = false }) {
  return <div className={`section-heading ${dark ? 'on-dark' : ''}`}><div><Eyebrow number={number}>{eyebrow}</Eyebrow><h2>{title}</h2></div>{copy && <p>{copy}</p>}</div>
}
export function ArrowLink({ to, children, light = false }) { return <Link to={to} className={`arrow-link ${light ? 'arrow-link-light' : ''}`}><span>{children}</span><b>↗</b></Link> }
export function ImageFrame({ src, alt = '', className = '', fallback = '' }) {
  const resolved = imageUrl(src, fallback)
  return <div className={`image-frame ${className}`}>{resolved ? <img src={resolved} alt={alt} loading="lazy" /> : <div className="image-fallback"><span>ME / ENGINEERING</span></div>}</div>
}
export function StateMessage({ type = 'empty', title, children, onRetry }) {
  return <div className={`state-message state-${type}`} role={type === 'error' ? 'alert' : 'status'}><span className="state-mark">{type === 'error' ? '!' : type === 'loading' ? '…' : '—'}</span><strong>{title}</strong>{children && <p>{children}</p>}{onRetry && <button className="text-button" type="button" onClick={onRetry}>Try again ↗</button>}</div>
}
export function ProjectCard({ project }) {
  return <article className="project-card">
    <Link className="project-card-image" to={`/projects/${project.slug}`} aria-label={`View ${project.title}`}>
      <ImageFrame src={project.coverImage} alt={project.title} fallback="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=85" />
      <span className="image-index">{project.isSample ? 'SAMPLE PROJECT' : (project.sector || 'PROJECT').toUpperCase()}</span><span className="image-arrow">↗</span>
    </Link>
    <div className="project-card-copy"><div><span className="eyebrow">{[project.city, project.province].filter(Boolean).join(', ') || 'PAKISTAN'}</span><h3><Link to={`/projects/${project.slug}`}>{project.title}</Link></h3></div><div className="project-card-meta"><span>{project.capacity || 'Engineering project'}</span><span>{(project.systemType || '').replaceAll('-', ' ')}</span></div></div>
  </article>
}
export function ServiceCard({ service, index = 0 }) {
  const iconMap = { electrical: '↗', solar: '☼', battery: '▥', ev: '⌁', architecture: '⌂', civil: '⌗' }
  return <Link to={`/services/${service.slug}`} className="service-row"><span className="service-number">{String(index + 1).padStart(2, '0')}</span><span className="service-symbol">{iconMap[service.icon] || '↗'}</span><span className="service-text"><strong>{service.title}</strong><small>{service.shortText || 'Engineering solutions designed around your requirements.'}</small></span><span className="service-arrow">↗</span></Link>
}
export function ArticleCard({ post }) {
  return <article className="article-card"><Link to={`/blog/${post.slug}`} className="article-image"><ImageFrame src={post.coverImage} alt={post.title} fallback="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85" /><span>READ STORY ↗</span></Link><div className="article-meta"><span>{post.category || 'Insights'}</span>{post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString()}</span>}</div><h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3></article>
}
