import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n } from '../../i18n/LanguageProvider'

const STEP_MS = 260

function shouldBoot() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return sessionStorage.getItem('dh-booted') !== '1'
  } catch {
    return false
  }
}

/** Courte séquence de démarrage façon terminal, jouée une fois par session */
export function BootLoader() {
  const { t } = useI18n()
  const [active, setActive] = useState(shouldBoot)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!active) return
    const lines = t.boot.length
    const interval = setInterval(() => setStep((s) => s + 1), STEP_MS)
    const done = setTimeout(() => {
      setActive(false)
      try {
        sessionStorage.setItem('dh-booted', '1')
      } catch {
        /* ignore */
      }
    }, STEP_MS * (lines + 1.4))
    return () => {
      clearInterval(interval)
      clearTimeout(done)
    }
  }, [active, t.boot.length])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          role="status"
          aria-live="polite"
        >
          <div className="w-[min(88vw,420px)] font-mono text-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg border border-line-strong font-display text-sm font-semibold text-accent">
                DH
              </span>
              <span className="text-faint">v5.0 · {new Date().getFullYear()}</span>
            </div>
            <ul className="space-y-1.5">
              {t.boot.slice(0, step + 1).map((line, i) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={i === t.boot.length - 1 ? 'text-success' : 'text-muted'}
                >
                  <span className="text-accent">❯</span> {line}
                </motion.li>
              ))}
            </ul>
            <div className="mt-6 h-px overflow-hidden bg-line">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-accent-3"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: (STEP_MS * (t.boot.length + 1)) / 1000, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
