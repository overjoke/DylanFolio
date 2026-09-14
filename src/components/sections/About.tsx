import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'
import { useI18n } from '../../i18n/LanguageProvider'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { TiltCard } from '../ui/TiltCard'
import { profile } from '../../data/profile'

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? value : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, value, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => controls.stop()
  }, [inView, value, reduce])

  return (
    <span ref={ref}>
      {n}
      <span className="text-accent">{suffix}</span>
    </span>
  )
}

function IdentityCard() {
  const { t } = useI18n()
  const rows = [
    [t.about.card.role, t.about.card.roleValue],
    [t.about.card.base, t.about.card.baseValue],
    [t.about.card.langs, t.about.card.langsValue],
    [t.about.card.mode, t.about.card.modeValue],
    [t.about.card.offline, t.about.card.offlineValue],
  ]

  return (
    <TiltCard max={9} className="holo-border">
      <div className="p-6 sm:p-7">
        {/* Avatar abstrait : monogramme holographique */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-elev">
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background:
                'radial-gradient(circle at 30% 25%, var(--accent-glow), transparent 55%), radial-gradient(circle at 80% 80%, color-mix(in oklab, var(--accent-3) 30%, transparent), transparent 50%)',
            }}
          />
          <div className="bg-grid absolute inset-0 opacity-70 [mask-image:none] [-webkit-mask-image:none]" />
          <div className="absolute inset-0 grid place-items-center" style={{ transform: 'translateZ(40px)' }}>
            <span className="font-display text-[clamp(5rem,14vw,8rem)] leading-none font-bold tracking-[-0.06em] text-gradient drop-shadow-[0_0_30px_var(--accent-glow)]">
              {profile.initials}
            </span>
          </div>
          <div className="scanline pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-[color-mix(in_oklab,var(--accent)_18%,transparent)] to-transparent" />
          <div className="absolute top-3 left-3 font-mono text-[10px] tracking-widest text-faint uppercase">id://dylane</div>
          <div className="absolute right-3 bottom-3 flex items-center gap-1.5 font-mono text-[10px] text-success">
            <span className="pulse-dot relative size-1.5 rounded-full bg-success" /> online
          </div>
        </div>

        <dl className="mt-6 space-y-2.5 font-mono text-[13px]">
          {rows.map(([k, v]) => (
            <div key={k} className="flex gap-3 border-b border-dashed border-line pb-2.5 last:border-0 last:pb-0">
              <dt className="w-24 shrink-0 text-faint">{k}</dt>
              <dd className="text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </TiltCard>
  )
}

export function About() {
  const { t } = useI18n()
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading number="01" index={t.about.index} title={t.about.title} />

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal>
            <IdentityCard />
          </Reveal>

          <div>
            <div className="space-y-5 text-lg leading-relaxed text-pretty text-muted">
              {t.about.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className={i === 0 ? 'text-ink' : ''}>{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
                {t.about.stats.map((s) => (
                  <div key={s.label} className="bg-bg p-5 sm:p-6">
                    <dt className="sr-only">{s.label}</dt>
                    <dd>
                      <p className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                        <Counter value={s.value} suffix={s.suffix} />
                      </p>
                      <p className="mt-2 text-sm text-muted">{s.label}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
