import { Brain, Container, Network, Radar, ShieldCheck, Headphones } from 'lucide-react'
import { useI18n } from '../../i18n/LanguageProvider'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { TiltCard } from '../ui/TiltCard'

const learningIcons = [Brain, Container, ShieldCheck]
const offIcons = [Network, Radar, Headphones]

function TerminalWindow({ command, children }: { command: string; children: React.ReactNode }) {
  return (
    <TiltCard max={4}>
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="size-2.5 rounded-full bg-rose-400/70" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-amber-400/70" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-emerald-400/70" aria-hidden="true" />
        <p className="ml-3 font-mono text-xs text-faint">
          <span className="text-success">dylane@dev</span>:<span className="text-accent">~</span>$ {command}
        </p>
      </div>
      <div className="p-6 sm:p-7">{children}</div>
    </TiltCard>
  )
}

export function Now() {
  const { t } = useI18n()

  const list = (items: { title: string; body: string }[], icons: typeof learningIcons) => (
    <ul className="space-y-6">
      {items.map((item, i) => {
        const Icon = icons[i]
        return (
          <li key={item.title} className="flex gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-accent-soft text-accent">
              <Icon className="size-[18px]" strokeWidth={1.7} />
            </span>
            <div>
              <h4 className="font-display font-semibold text-ink">{item.title}</h4>
              <p className="mt-1 text-[15px] text-muted">{item.body}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )

  return (
    <section id="now" className="relative py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading number="07" index={t.now.index} title={t.now.title} subtitle={t.now.subtitle} />
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-xs text-muted">
              <span className="pulse-dot relative size-1.5 rounded-full bg-success text-success" aria-hidden="true" />
              {t.now.updated}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <Reveal>
            <TerminalWindow command="cat learning.md">
              <p className="mb-6 font-mono text-xs tracking-widest text-accent uppercase"># {t.now.learningTitle}</p>
              {list(t.now.learning, learningIcons)}
            </TerminalWindow>
          </Reveal>
          <Reveal delay={0.1}>
            <TerminalWindow command="cat offline.md">
              <p className="mb-6 font-mono text-xs tracking-widest text-accent uppercase"># {t.now.offTitle}</p>
              {list(t.now.off, offIcons)}
            </TerminalWindow>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
