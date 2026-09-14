import { lazy, Suspense, useEffect, useState, type MouseEvent } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDownRight, Download } from 'lucide-react'
import { useI18n } from '../../i18n/LanguageProvider'
import { useTheme } from '../../lib/theme'
import { scrollToId } from '../../lib/scroll'
import { profile } from '../../data/profile'
import { ease } from '../ui/Reveal'
import { ScrambleText } from '../ui/ScrambleText'

const HeroScene = lazy(() => import('../three/HeroScene'))

function Typewriter({ words }: { words: string[] }) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [text, setText] = useState(reduce ? words[0] : '')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setIndex(0)
    setText(reduce ? words[0] : '')
    setDeleting(false)
  }, [words, reduce])

  useEffect(() => {
    if (reduce) return
    const word = words[index % words.length]
    let delay = deleting ? 28 : 55
    if (!deleting && text === word) delay = 2000
    if (deleting && text === '') delay = 300

    const id = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true)
      else if (deleting && text === '') {
        setDeleting(false)
        setIndex((i) => i + 1)
      } else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1))
    }, delay)
    return () => clearTimeout(id)
  }, [text, deleting, index, words, reduce])

  return (
    <span className="text-ink">
      {text}
      <span className="caret ml-0.5 inline-block h-[1.1em] w-[0.55ch] translate-y-[0.18em] bg-accent" aria-hidden="true" />
    </span>
  )
}

export function Hero() {
  const { t } = useI18n()
  const { theme } = useTheme()
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const sceneY = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 180])
  const sceneOpacity = useTransform(scrollY, [0, 700], [1, 0.15])
  const contentY = useTransform(scrollY, [0, 800], [0, reduce ? 0 : -60])

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    scrollToId(id)
  }

  const item = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 1, ease, delay },
  })

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20">
      <motion.div className="absolute inset-0" style={{ y: sceneY, opacity: sceneOpacity }} aria-hidden="true">
        <Suspense fallback={null}>
          <HeroScene theme={theme} />
        </Suspense>
        {/* Voile pour garder le texte lisible au-dessus de la 3D sur mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/20 to-bg lg:bg-gradient-to-r lg:from-bg/85 lg:via-bg/30 lg:to-transparent" />
      </motion.div>

      <motion.div style={{ y: contentY }} className="container-x relative">
        <div className="max-w-2xl">
          <motion.div {...item(0.1)} className="flex flex-wrap items-center gap-3">
            <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-ink">
              <span className="pulse-dot relative size-2 rounded-full bg-success text-success" aria-hidden="true" />
              {t.hero.status}
            </span>
            <span className="hidden font-mono text-xs text-faint sm:inline">{profile.coords}</span>
          </motion.div>

          <motion.p {...item(0.2)} className="mt-8 font-mono text-sm tracking-wide text-accent">
            <ScrambleText text={`// ${t.hero.kicker}`} />
          </motion.p>

          <motion.h1
            {...item(0.3)}
            className="mt-3 font-display text-[clamp(3rem,10vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.04em] text-ink"
          >
            Dylane
            <br />
            <span className="text-gradient">Hengla</span>
          </motion.h1>

          <motion.p {...item(0.45)} className="mt-6 font-display text-xl font-medium text-ink sm:text-2xl">
            {t.hero.role}
          </motion.p>

          <motion.p {...item(0.55)} className="mt-5 min-h-[3.2em] font-mono text-[15px] text-muted sm:text-base">
            <span className="text-accent">❯</span> {t.hero.typePrefix} <Typewriter words={t.hero.typeWords} />
          </motion.p>

          <motion.p {...item(0.65)} className="mt-4 max-w-xl text-lg text-pretty text-muted">
            {t.hero.intro}
          </motion.p>

          <motion.div {...item(0.8)} className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              onClick={go('work')}
              className="group relative inline-flex h-12 cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-accent px-6 font-medium text-white shadow-[0_10px_40px_-10px_var(--accent-glow)] transition-shadow duration-300 hover:shadow-[0_16px_50px_-8px_var(--accent-glow)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
              {t.hero.ctaWork}
              <ArrowDownRight className="size-4 transition-transform duration-300 group-hover:rotate-[-45deg]" />
            </a>
            <a
              href={profile.cv}
              download
              className="glass inline-flex h-12 cursor-pointer items-center gap-2 rounded-full px-6 font-medium text-ink transition-colors duration-200 hover:border-line-strong"
            >
              <Download className="size-4" />
              {t.hero.ctaCv}
            </a>
          </motion.div>
        </div>
      </motion.div>

      <motion.a
        href="#about"
        onClick={go('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 cursor-pointer flex-col items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-faint uppercase sm:flex"
      >
        {t.hero.scroll}
        <span className="relative h-10 w-px overflow-hidden bg-line-strong">
          <span className="scanline absolute inset-x-0 top-0 h-1/3 bg-accent" />
        </span>
      </motion.a>
    </section>
  )
}
