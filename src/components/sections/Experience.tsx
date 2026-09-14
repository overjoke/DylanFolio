import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { GraduationCap } from 'lucide-react'
import { useI18n } from '../../i18n/LanguageProvider'
import { experience } from '../../data/profile'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

function formatPeriod(value: string, lang: string) {
  if (!value.includes('-')) return value
  const [y, m] = value.split('-').map(Number)
  const label = new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', year: 'numeric' }).format(new Date(y, m - 1))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function Experience() {
  const { t, lang } = useI18n()
  const reduce = useReducedMotion()
  const timeline = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: timeline, offset: ['start 75%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading number="05" index={t.experience.index} title={t.experience.title} />

        <div className="mt-14 grid gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
          {/* Expérience : ligne qui se dessine au scroll */}
          <ol ref={timeline} className="relative">
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-line" />
            <motion.span
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-gradient-to-b from-accent via-accent-2 to-accent-3"
              style={{ scaleY: reduce ? 1 : progress }}
            />
            {experience.map((job, i) => {
              const copy = t.experience.items[job.id]
              const current = job.period[1] === null
              return (
                <li key={job.id} className="relative pb-12 pl-10 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`absolute top-1.5 left-0 grid size-[15px] place-items-center rounded-full border bg-bg ${current ? 'border-accent' : 'border-line-strong'}`}
                  >
                    <span className={`size-[7px] rounded-full ${current ? 'pulse-dot relative bg-accent text-accent' : 'bg-faint'}`} />
                  </span>
                  <Reveal delay={i * 0.05}>
                    <p className="font-mono text-xs text-faint">
                      {formatPeriod(job.period[0], lang)} — {job.period[1] ? formatPeriod(job.period[1], lang) : <span className="text-accent">{t.experience.present}</span>}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">{copy.role}</h3>
                    <p className="mt-0.5 text-accent">{job.company}</p>
                    <ul className="mt-4 space-y-2 text-muted">
                      {copy.bullets.map((b) => (
                        <li key={b} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-line-strong" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {job.stack.map((s) => (
                        <li key={s} className="rounded-md border border-line bg-elev px-2 py-0.5 font-mono text-[11px] text-muted">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </li>
              )
            })}
          </ol>

          {/* Formation */}
          <Reveal>
            <div className="glass rounded-2xl p-7 lg:sticky lg:top-28">
              <h3 className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink">
                <GraduationCap className="size-5 text-accent" strokeWidth={1.7} />
                {t.experience.educationTitle}
              </h3>
              <ol className="mt-6 space-y-5">
                {t.experience.education.map((e) => (
                  <li key={e.year} className="grid grid-cols-[3.25rem_1fr] gap-3">
                    <span className="font-mono text-sm text-accent">{e.year}</span>
                    <div>
                      <p className="font-medium text-ink">{e.title}</p>
                      <p className="text-sm text-muted">{e.school}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
