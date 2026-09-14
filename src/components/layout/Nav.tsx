import { useEffect, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, Moon, Sun, SquareTerminal, X } from 'lucide-react'
import { useI18n } from '../../i18n/LanguageProvider'
import { useTheme } from '../../lib/theme'
import { scrollToId } from '../../lib/scroll'

const links = ['about', 'work', 'experience', 'stack', 'now', 'contact'] as const

export function Nav({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  const { t, lang, toggleLang } = useI18n()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Section active dans la barre de navigation
  useEffect(() => {
    const sections = links.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollToId(id)
  }

  const toggleTheme = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setTheme(theme === 'dark' ? 'light' : 'dark', { x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }

  const iconBtn =
    'grid size-10 cursor-pointer place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-accent-soft hover:text-ink'

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4">
      <nav
        aria-label="Principale"
        className={`mx-auto flex max-w-[1200px] items-center justify-between rounded-full py-2 pr-2 pl-3 transition-all duration-500 ${
          scrolled || open ? 'glass' : 'border border-transparent'
        }`}
      >
        <a href="#top" onClick={go('top')} className="flex cursor-pointer items-center gap-2.5 rounded-full pr-2" aria-label="Dylane Hengla">
          <span className="holo-border grid size-9 place-items-center rounded-full bg-elev font-display text-[13px] font-bold text-ink">DH</span>
          <span className="hidden font-display text-[15px] font-semibold tracking-tight sm:inline">
            dylane<span className="text-accent">.</span>dev
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={go(id)}
                className={`relative cursor-pointer rounded-full px-3.5 py-2 text-sm transition-colors duration-200 ${
                  active === id ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {active === id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-accent-soft" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button type="button" onClick={onOpenTerminal} className={`${iconBtn} hidden sm:grid`} aria-label={t.a11y.openTerminal} title="Ctrl + K">
            <SquareTerminal className="size-[18px]" />
          </button>
          <button
            type="button"
            onClick={toggleLang}
            className="h-10 cursor-pointer rounded-full px-3 font-mono text-xs font-medium text-muted transition-colors duration-200 hover:bg-accent-soft hover:text-ink"
            aria-label={t.a11y.switchLang}
          >
            <span className={lang === 'fr' ? 'text-accent' : ''}>FR</span>
            <span className="mx-1 text-faint">/</span>
            <span className={lang === 'en' ? 'text-accent' : ''}>EN</span>
          </button>
          <button type="button" onClick={toggleTheme} className={iconBtn} aria-label={theme === 'dark' ? t.a11y.themeToLight : t.a11y.themeToDark}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25 }}
              >
                {theme === 'dark' ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              </motion.span>
            </AnimatePresence>
          </button>
          <a
            href="#contact"
            onClick={go('contact')}
            className="ml-1 hidden h-10 cursor-pointer items-center rounded-full bg-ink px-4 text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-85 md:inline-flex"
          >
            {t.nav.cta}
          </a>
          <button
            type="button"
            className={`${iconBtn} lg:hidden`}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="glass mx-auto mt-2 max-w-[1200px] rounded-3xl p-3 lg:hidden"
          >
            <ul className="grid gap-1">
              {links.map((id, i) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={go(id)}
                    className="flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3 text-base text-ink transition-colors hover:bg-accent-soft"
                  >
                    {t.nav[id]}
                    <span className="font-mono text-xs text-faint">0{i + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onOpenTerminal()
              }}
              className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-2xl px-4 py-3 font-mono text-sm text-muted hover:bg-accent-soft"
            >
              <SquareTerminal className="size-4" /> {t.a11y.openTerminal}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
