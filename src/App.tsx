import { useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { useI18n } from './i18n/LanguageProvider'
import { initSmoothScroll } from './lib/scroll'
import { Background, ScrollProgress } from './components/layout/Background'
import { BootLoader } from './components/layout/BootLoader'
import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
import { Terminal } from './components/layout/Terminal'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Services } from './components/sections/Services'
import { CaseStudy } from './components/sections/CaseStudy'
import { Projects } from './components/sections/Projects'
import { Experience } from './components/sections/Experience'
import { Stack } from './components/sections/Stack'
import { Now } from './components/sections/Now'
import { Contact } from './components/sections/Contact'

export default function App() {
  const { t } = useI18n()
  const [terminalOpen, setTerminalOpen] = useState(false)

  useEffect(() => initSmoothScroll(), [])

  // Raccourcis : Ctrl/Cmd + K ou ` pour ouvrir le terminal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setTerminalOpen((o) => !o)
      } else if (e.key === '`' && !typing) {
        e.preventDefault()
        setTerminalOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="fixed top-3 left-3 z-[110] -translate-y-20 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0"
      >
        {t.a11y.skip}
      </a>
      <BootLoader />
      <ScrollProgress />
      <Background />
      <Nav onOpenTerminal={() => setTerminalOpen(true)} />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <CaseStudy />
        <Projects />
        <Experience />
        <Stack />
        <Now />
        <Contact />
      </main>
      <Footer onOpenTerminal={() => setTerminalOpen(true)} />
      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </MotionConfig>
  )
}
