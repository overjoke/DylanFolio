import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChartColumn, Database, Monitor, Package, Receipt, ServerCog, UtensilsCrossed, TriangleAlert, Check } from 'lucide-react'
import { useI18n } from '../../i18n/LanguageProvider'
import type { Dict } from '../../i18n/translations'
import { Reveal, ease } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

type ModuleKey = 'orders' | 'stock' | 'billing' | 'dashboard'
const moduleIcons: Record<ModuleKey, typeof Receipt> = {
  orders: UtensilsCrossed,
  stock: Package,
  billing: Receipt,
  dashboard: ChartColumn,
}

type Mock = Dict['kula']['mock']

const fcfa = (n: number, lang: string) => `${new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US').format(n)} FCFA`

/* ───────── Panneaux de démonstration ───────── */

function OrdersPanel({ m }: { m: Mock }) {
  // 0 libre · 1 occupée · 2 à encaisser
  const states = [1, 0, 2, 1, 0, 1, 1, 0, 2, 0, 1, 0]
  const style = ['border-line text-faint', 'border-accent/60 bg-accent-soft text-accent', 'border-amber-500/60 bg-amber-500/10 text-amber-600 dark:text-amber-400']
  return (
    <div className="grid gap-4 sm:grid-cols-[1.3fr_1fr]">
      <div>
        <p className="mb-3 text-xs font-medium text-muted">{m.tables}</p>
        <div className="grid grid-cols-4 gap-2">
          {states.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.35 }}
              className={`grid aspect-square place-items-center rounded-lg border font-mono text-xs ${style[s]}`}
            >
              T{i + 1}
            </motion.div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted">
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-full border border-line" />{m.free}</span>
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-accent" />{m.busy}</span>
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-amber-500" />{m.bill}</span>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-line bg-bg p-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-muted">{m.ticket} #0427</p>
          <p className="font-mono text-xs text-accent">{m.table} 4</p>
        </div>
        <ul className="mt-3 space-y-2 text-sm">
          {m.items.slice(0, 3).map((it, i) => (
            <li key={it} className="flex justify-between text-ink">
              <span>{it}</span>
              <span className="font-mono text-faint">×{[2, 1, 1][i]}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-1 text-[11px] font-medium text-success">
          <Check className="size-3" /> {m.sentToKitchen}
        </p>
      </motion.div>
    </div>
  )
}

function StockPanel({ m }: { m: Mock }) {
  const levels = [72, 45, 18, 60, 34]
  return (
    <div>
      <p className="mb-4 text-xs font-medium text-muted">{m.stock}</p>
      <ul className="space-y-3.5">
        {m.ingredients.map((name, i) => {
          const low = levels[i] < 25
          return (
            <li key={name}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-ink">{name}</span>
                <span className="flex items-center gap-2 font-mono text-xs text-muted">
                  {low && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/12 px-2 py-0.5 text-rose-600 dark:text-rose-400">
                      <TriangleAlert className="size-3" /> {m.low}
                    </span>
                  )}
                  {levels[i]}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-line">
                <motion.div
                  className={`h-full rounded-full ${low ? 'bg-rose-500' : 'bg-gradient-to-r from-accent to-accent-3'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${levels[i]}%` }}
                  transition={{ duration: 0.9, ease, delay: i * 0.07 }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function BillingPanel({ m, lang }: { m: Mock; lang: string }) {
  const prices = [6500, 4000, 5500, 1000]
  const total = prices.reduce((a, b) => a + b, 0)
  return (
    <div className="mx-auto max-w-sm">
      <div className="relative rounded-xl border border-line bg-bg p-5 font-mono text-[13px]">
        <div className="flex items-center justify-between border-b border-dashed border-line pb-3">
          <span className="font-display text-base font-semibold text-ink">{m.receipt}</span>
          <span className="text-faint">#0427 · T4</span>
        </div>
        <ul className="space-y-2 py-3">
          {m.items.map((it, i) => (
            <motion.li key={it} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="flex justify-between gap-4">
              <span className="text-ink">{it}</span>
              <span className="text-muted">{fcfa(prices[i], lang)}</span>
            </motion.li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-dashed border-line pt-3 text-sm font-semibold text-ink">
          <span>{m.total}</span>
          <span>{fcfa(total, lang)}</span>
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 1.6, rotate: -18 }}
          animate={{ opacity: 1, scale: 1, rotate: -12 }}
          transition={{ delay: 0.45, type: 'spring', stiffness: 300, damping: 16 }}
          className="absolute -top-3.5 right-4 rounded-md border-2 border-success bg-bg px-2.5 py-0.5 font-display text-sm font-bold tracking-widest text-success uppercase"
        >
          {m.paid}
        </motion.span>
      </div>
    </div>
  )
}

function DashboardPanel({ m, lang }: { m: Mock; lang: string }) {
  const values = [42, 55, 48, 63, 88, 100, 71]
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
      <div>
        <p className="text-xs font-medium text-muted">{m.revenue}</p>
        <p className="mt-1 font-display text-2xl font-semibold text-ink">{fcfa(1284500, lang)}</p>
        <div className="mt-5 flex h-36 items-end gap-2">
          {values.map((v, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <motion.div
                className={`w-full rounded-t-md ${i === 5 ? 'bg-gradient-to-t from-accent to-accent-2' : 'bg-accent/25'}`}
                initial={{ height: 0 }}
                animate={{ height: `${v}%` }}
                transition={{ duration: 0.8, ease, delay: i * 0.05 }}
              />
              <span className="font-mono text-[10px] text-faint">{m.days[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-line bg-bg p-4 sm:w-40">
        <p className="text-xs text-muted">{m.topDish}</p>
        <p className="mt-1 font-display font-semibold text-ink">{m.items[0]}</p>
        <p className="mt-3 font-mono text-2xl text-accent">148</p>
        <p className="text-[11px] text-faint">/ 7 {lang === 'fr' ? 'jours' : 'days'}</p>
      </div>
    </div>
  )
}

/* ───────── Section ───────── */

export function CaseStudy() {
  const { t, lang } = useI18n()
  const k = t.kula
  const reduce = useReducedMotion()
  const [active, setActive] = useState<ModuleKey>('orders')
  const [paused, setPaused] = useState(false)
  const keys = useMemo(() => k.modules.map((mod) => mod.key as ModuleKey), [k.modules])

  // Rotation automatique des modules tant que l'utilisateur n'interagit pas
  useEffect(() => {
    if (paused || reduce) return
    const id = setInterval(() => {
      setActive((cur) => keys[(keys.indexOf(cur) + 1) % keys.length])
    }, 5200)
    return () => clearInterval(id)
  }, [paused, reduce, keys])

  const current = k.modules.find((mod) => mod.key === active)!

  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading number="03" index={k.index} title={k.sectionTitle} />

        <Reveal className="mt-14">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-elev">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-40 right-0 h-96 w-2/3 opacity-60 blur-3xl"
              style={{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)' }}
            />

            {/* En-tête du projet */}
            <div className="relative grid gap-8 border-b border-line p-7 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[11px] tracking-widest text-accent uppercase">
                  <span className="size-1.5 rounded-full bg-accent" /> {k.label}
                </span>
                <h3 className="mt-5 font-display text-6xl font-bold tracking-[-0.05em] text-ink sm:text-7xl">{k.title}</h3>
                <p className="mt-3 max-w-md text-xl text-pretty text-muted">{k.tagline}</p>
              </div>
              <dl className="grid gap-4 text-sm sm:grid-cols-3 lg:grid-cols-1">
                {[
                  [k.meta.role, k.meta.roleValue],
                  [k.meta.stack, 'React · Laravel · MySQL'],
                  [k.meta.type, k.meta.typeValue],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-1 lg:flex-row lg:gap-4">
                    <dt className="font-mono text-xs text-faint uppercase lg:w-16 lg:pt-0.5">{label}</dt>
                    <dd className="text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative grid lg:grid-cols-[1fr_1.35fr]">
              {/* Récit */}
              <div className="space-y-8 border-b border-line p-7 sm:p-10 lg:border-r lg:border-b-0">
                <div>
                  <h4 className="font-mono text-xs tracking-widest text-accent uppercase">{k.challengeTitle}</h4>
                  <p className="mt-3 text-muted">{k.challenge}</p>
                </div>
                <div>
                  <h4 className="font-mono text-xs tracking-widest text-accent uppercase">{k.roleTitle}</h4>
                  <p className="mt-3 text-muted">{k.roleBody}</p>
                </div>

                <div role="tablist" aria-label={k.modulesTitle} className="grid gap-2">
                  {k.modules.map((mod) => {
                    const Icon = moduleIcons[mod.key as ModuleKey]
                    const selected = mod.key === active
                    return (
                      <button
                        key={mod.key}
                        role="tab"
                        type="button"
                        id={`tab-${mod.key}`}
                        aria-selected={selected}
                        aria-controls="kula-panel"
                        onClick={() => {
                          setActive(mod.key as ModuleKey)
                          setPaused(true)
                        }}
                        className={`relative flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-left transition-colors duration-200 ${
                          selected ? 'border-accent/50 bg-accent-soft' : 'border-transparent hover:bg-accent-soft/60'
                        }`}
                      >
                        <Icon className={`mt-0.5 size-[18px] shrink-0 ${selected ? 'text-accent' : 'text-faint'}`} />
                        <span>
                          <span className={`block font-medium ${selected ? 'text-ink' : 'text-muted'}`}>{mod.title}</span>
                          {selected && <span className="mt-1 block text-sm text-muted">{mod.body}</span>}
                        </span>
                        {selected && !paused && !reduce && (
                          <motion.span
                            key={active}
                            className="absolute bottom-0 left-3 h-px bg-accent"
                            initial={{ width: 0 }}
                            animate={{ width: 'calc(100% - 1.5rem)' }}
                            transition={{ duration: 5.2, ease: 'linear' }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Fenêtre d'application simulée */}
              <div className="p-5 sm:p-8" onPointerEnter={() => setPaused(true)}>
                <div className="overflow-hidden rounded-2xl border border-line-strong bg-surface-strong shadow-[var(--shadow)]">
                  <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                    <div className="flex gap-1.5" aria-hidden="true">
                      <span className="size-2.5 rounded-full bg-rose-400/70" />
                      <span className="size-2.5 rounded-full bg-amber-400/70" />
                      <span className="size-2.5 rounded-full bg-emerald-400/70" />
                    </div>
                    <p className="flex-1 truncate rounded-md bg-bg px-3 py-1 text-center font-mono text-[11px] text-faint">kula.app/{active}</p>
                    <span className="hidden font-mono text-[10px] text-faint sm:inline">{k.mock.demo}</span>
                  </div>
                  <div className="flex">
                    <div className="hidden flex-col gap-1 border-r border-line p-2 sm:flex" aria-hidden="true">
                      {keys.map((key) => {
                        const Icon = moduleIcons[key]
                        return (
                          <span key={key} className={`grid size-9 place-items-center rounded-lg ${key === active ? 'bg-accent text-white' : 'text-faint'}`}>
                            <Icon className="size-4" />
                          </span>
                        )
                      })}
                    </div>
                    <div id="kula-panel" role="tabpanel" aria-labelledby={`tab-${active}`} aria-label={current.title} className="min-h-[300px] flex-1 p-5">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={active}
                          initial={reduce ? false : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          {active === 'orders' && <OrdersPanel m={k.mock} />}
                          {active === 'stock' && <StockPanel m={k.mock} />}
                          {active === 'billing' && <BillingPanel m={k.mock} lang={lang} />}
                          {active === 'dashboard' && <DashboardPanel m={k.mock} lang={lang} />}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-center font-mono text-[11px] text-faint sm:hidden">{k.mock.demo}</p>
              </div>
            </div>

            {/* Architecture */}
            <div className="relative border-t border-line p-7 sm:p-10">
              <h4 className="font-mono text-xs tracking-widest text-accent uppercase">{k.archTitle}</h4>
              <div className="mt-6 grid items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
                {[
                  { icon: Monitor, title: k.arch.client, sub: k.arch.clientSub },
                  { icon: ServerCog, title: k.arch.api, sub: k.arch.apiSub },
                  { icon: Database, title: k.arch.db, sub: k.arch.dbSub },
                ].flatMap((node, i, arr) => {
                  const Icon = node.icon
                  const card = (
                    <div key={node.title} className="flex items-center gap-4 rounded-xl border border-line bg-bg p-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                        <Icon className="size-5" strokeWidth={1.6} />
                      </span>
                      <div>
                        <p className="font-medium text-ink">{node.title}</p>
                        <p className="font-mono text-xs text-faint">{node.sub}</p>
                      </div>
                    </div>
                  )
                  if (i === arr.length - 1) return [card]
                  return [
                    card,
                    <div key={`link-${i}`} aria-hidden="true" className="flex justify-center md:w-16">
                      <svg className="h-4 w-10 rotate-90 md:w-16 md:rotate-0" viewBox="0 0 64 16" preserveAspectRatio="none">
                        <line x1="0" y1="8" x2="64" y2="8" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4" className="[animation:dash_1s_linear_infinite]" />
                      </svg>
                    </div>,
                  ]
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
