import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'

export type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  /** Bascule le thème ; `origin` sert de centre à l'animation circulaire */
  setTheme: (theme: Theme, origin?: { x: number; y: number }) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )

  const setTheme = useCallback((next: Theme, origin?: { x: number; y: number }) => {
    const apply = () => {
      document.documentElement.classList.toggle('dark', next === 'dark')
      setThemeState(next)
      try {
        localStorage.setItem('dh-theme', next)
      } catch {
        /* stockage indisponible */
      }
    }

    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }
    if (!doc.startViewTransition || prefersReducedMotion()) {
      apply()
      return
    }

    const x = origin?.x ?? window.innerWidth - 40
    const y = origin?.y ?? 40
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    const transition = doc.startViewTransition(() => flushSync(apply))
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }, [])

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
