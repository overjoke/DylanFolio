import { ArrowUpRight, Lock } from 'lucide-react'
import { useI18n } from '../../i18n/LanguageProvider'
import { clientSites, projects, type Project } from '../../data/profile'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { TiltCard } from '../ui/TiltCard'
import { GithubIcon } from '../ui/Icons'

/** Couverture générative unique par projet (pas de capture d'écran nécessaire) */
function Cover({ project }: { project: Project }) {
  const h = project.hue
  return (
    <div className="relative h-40 overflow-hidden border-b border-line" aria-hidden="true">
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
        style={{
          background: `radial-gradient(circle at 20% 20%, hsl(${h} 90% 65% / 0.45), transparent 50%),
            radial-gradient(circle at 85% 70%, hsl(${(h + 60) % 360} 90% 60% / 0.35), transparent 55%),
            linear-gradient(135deg, hsl(${h} 40% 50% / 0.08), transparent)`,
        }}
      />
      <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      <span
        className="absolute -bottom-6 left-5 font-display text-8xl font-bold tracking-[-0.06em] text-ink/10 transition-transform duration-700 ease-out group-hover:-translate-y-2"
      >
        {project.mark}
      </span>
      <div className="absolute top-4 right-4 flex gap-1">
        {project.stack.slice(0, 3).map((s) => (
          <span key={s} className="rounded-full bg-bg/70 px-2 py-0.5 font-mono text-[10px] text-muted backdrop-blur">
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Projects() {
  const { t } = useI18n()

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading number="04" index={t.projects.index} title={t.projects.title} subtitle={t.projects.subtitle} />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => {
            const copy = t.projects.items[p.id]
            return (
              <li key={p.id}>
                <Reveal delay={(i % 3) * 0.07} className="h-full">
                  <TiltCard>
                    <article className="flex h-full flex-col">
                      <Cover project={p} />
                      <div className="flex flex-1 flex-col p-6">
                        <p className="font-mono text-[11px] tracking-widest text-accent uppercase">{copy.type}</p>
                        <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">{p.name}</h3>
                        <p className="mt-2 flex-1 text-[15px] text-muted">{copy.body}</p>
                        <div className="mt-5 flex flex-wrap items-center gap-2">
                          {p.live && (
                            <a
                              href={p.live}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-ink px-3.5 text-sm font-medium text-bg transition-opacity hover:opacity-85"
                            >
                              {t.projects.live}
                              <ArrowUpRight className="size-3.5" />
                              <span className="sr-only">({p.name}, {t.a11y.external})</span>
                            </a>
                          )}
                          {p.code && (
                            <a
                              href={p.code}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-line px-3.5 text-sm text-ink transition-colors hover:border-line-strong hover:bg-accent-soft"
                            >
                              <GithubIcon className="size-3.5" />
                              {t.projects.code}
                              <span className="sr-only">({p.name}, {t.a11y.external})</span>
                            </a>
                          )}
                          {!p.live && !p.code && (
                            <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-dashed border-line px-3.5 text-sm text-faint">
                              <Lock className="size-3.5" />
                              {t.projects.private}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </TiltCard>
                </Reveal>
              </li>
            )
          })}
        </ul>

        {/* Sites clients */}
        <Reveal className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">{t.projects.sitesTitle}</h3>
            <p className="max-w-sm text-sm text-faint">{t.projects.sitesNote}</p>
          </div>
          <ul className="mt-6 border-t border-line">
            {clientSites.map((site) => (
              <li key={site.url} className="border-b border-line">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex cursor-pointer items-center gap-4 overflow-hidden py-5 sm:gap-8"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-left scale-x-0 bg-accent-soft transition-transform duration-500 ease-out group-hover:scale-x-100"
                  />
                  <span className="relative w-12 font-mono text-xs text-faint">{site.year}</span>
                  <span className="relative flex-1 font-display text-lg font-medium text-ink transition-transform duration-300 group-hover:translate-x-2 sm:text-xl">
                    {site.name}
                  </span>
                  <span className="relative hidden rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted sm:inline">
                    {t.projects.categories[site.category]}
                  </span>
                  <span className="relative hidden font-mono text-xs text-faint md:inline">WordPress</span>
                  <ArrowUpRight className="relative mr-2 size-5 text-faint transition-all duration-300 group-hover:rotate-45 group-hover:text-accent" />
                  <span className="sr-only">({t.a11y.external})</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
