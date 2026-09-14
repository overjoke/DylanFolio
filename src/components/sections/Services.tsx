import type { MouseEvent } from 'react'
import { AppWindow, ArrowRight, Download, Gauge, Server, Blocks } from 'lucide-react'
import { useI18n } from '../../i18n/LanguageProvider'
import { profile } from '../../data/profile'
import { scrollToId } from '../../lib/scroll'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { TiltCard } from '../ui/TiltCard'

const icons = [AppWindow, Server, Gauge, Blocks]
const tags = [
  ['Angular', 'React', 'Next.js'],
  ['Laravel', 'Django', 'Spring Boot'],
  ['Cache', 'Minification', 'SEO'],
  ['WordPress', 'Moodle', 'Dolibarr'],
]

export function Services() {
  const { t } = useI18n()

  const toContact = (e: MouseEvent) => {
    e.preventDefault()
    scrollToId('contact')
  }

  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading number="02" index={t.services.index} title={t.services.title} subtitle={t.services.subtitle} />

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {t.services.items.map((s, i) => {
            const Icon = icons[i]
            return (
              <Reveal key={s.title} delay={i * 0.06}>
                <TiltCard max={5}>
                  <article className="flex h-full flex-col p-7 sm:p-8">
                    <div className="flex items-start justify-between">
                      <span className="grid size-12 place-items-center rounded-xl border border-line bg-accent-soft text-accent">
                        <Icon className="size-[22px]" strokeWidth={1.6} />
                      </span>
                      <span className="font-mono text-xs text-faint">0{i + 1}</span>
                    </div>
                    <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-ink">{s.title}</h3>
                    <p className="mt-3 text-muted">{s.body}</p>
                    <ul className="mt-6 flex flex-wrap gap-2 pt-1">
                      {tags[i].map((tag) => (
                        <li key={tag} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </article>
                </TiltCard>
              </Reveal>
            )
          })}
        </div>

        {/* Double appel à l'action : recruteurs et clients */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Reveal delay={0.05}>
            <a
              href={profile.cv}
              download
              className="group flex h-full cursor-pointer items-center justify-between gap-6 rounded-2xl border border-line bg-elev p-7 transition-colors duration-300 hover:border-accent"
            >
              <div>
                <p className="font-mono text-xs tracking-widest text-accent uppercase">{t.services.recruiter.eyebrow}</p>
                <p className="mt-2 font-display text-xl font-semibold text-ink">{t.services.recruiter.title}</p>
                <p className="mt-1 text-sm text-muted">{t.services.recruiter.action} · PDF</p>
              </div>
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line text-ink transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                <Download className="size-5" />
              </span>
            </a>
          </Reveal>
          <Reveal delay={0.12}>
            <a
              href="#contact"
              onClick={toContact}
              className="group relative flex h-full cursor-pointer items-center justify-between gap-6 overflow-hidden rounded-2xl bg-ink p-7 text-bg"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: 'radial-gradient(600px circle at 100% 50%, var(--accent), transparent 60%)' }}
              />
              <div className="relative">
                <p className="font-mono text-xs tracking-widest uppercase opacity-70">{t.services.client.eyebrow}</p>
                <p className="mt-2 font-display text-xl font-semibold">{t.services.client.title}</p>
                <p className="mt-1 text-sm opacity-70">{t.services.client.action}</p>
              </div>
              <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-bg text-ink transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="size-5" />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
