import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useI18n } from '../../i18n/LanguageProvider'
import { useTheme } from '../../lib/theme'
import { scrollToId, setScrollLocked } from '../../lib/scroll'
import { experience, profile, projects, stackGroups } from '../../data/profile'

type Line = { id: number; content: ReactNode }

const COMMANDS = ['help', 'whoami', 'skills', 'projects', 'experience', 'now', 'contact', 'neofetch', 'cv', 'theme', 'lang', 'goto', 'clear', 'exit'] as const
const SECTIONS = ['about', 'services', 'work', 'projects', 'experience', 'stack', 'now', 'contact']

const ASCII = String.raw`
 ____  _   _
|  _ \| | | |
| | | | |_| |
| |_| |  _  |
|____/|_| |_|`

let uid = 0

export function Terminal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang, setLang } = useI18n()
  const { theme, setTheme } = useTheme()
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const push = (...content: ReactNode[]) => setLines((prev) => [...prev, ...content.map((c) => ({ id: uid++, content: c }))])

  useEffect(() => {
    if (!open) return
    setScrollLocked(true)
    const previouslyFocused = document.activeElement as HTMLElement | null
    if (lines.length === 0) push(<span className="text-muted">{t.terminal.welcome}</span>)
    const id = setTimeout(() => inputRef.current?.focus(), 50)
    return () => {
      clearTimeout(id)
      setScrollLocked(false)
      previouslyFocused?.focus?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [lines])

  const kv = (k: string, v: ReactNode) => (
    <span>
      <span className="text-accent">{k.padEnd(12, ' ')}</span>
      {v}
    </span>
  )

  const run = (raw: string) => {
    const [cmd = '', ...args] = raw.trim().split(/\s+/)
    const name = cmd.toLowerCase()
    push(
      <span>
        <span className="text-success">dylane@portfolio</span>:<span className="text-accent">~</span>$ {raw}
      </span>,
    )
    if (!name) return

    switch (name) {
      case 'help':
        push(...COMMANDS.map((c) => kv(c, <span className="text-muted">{t.terminal.help[c]}</span>)))
        break
      case 'whoami':
        push(t.terminal.whoami)
        break
      case 'skills':
      case 'stack':
        push(...stackGroups.map((g) => kv(t.stack.groups[g.key].split(/[ ,]/)[0].toLowerCase(), g.items.join(' · '))))
        break
      case 'projects':
      case 'ls':
        push(
          kv('kula/', <span className="text-muted">React · Laravel · MySQL</span>),
          ...projects.map((p) => kv(`${p.id}/`, <span className="text-muted">{p.stack.join(' · ')}</span>)),
        )
        break
      case 'experience':
        push(...experience.map((e) => kv(e.period[0].slice(0, 4), `${t.experience.items[e.id].role} @ ${e.company}`)))
        break
      case 'now':
        push(...t.now.learning.map((l) => <span>→ {l.title}</span>))
        break
      case 'contact':
        push(kv('email', profile.email), kv('whatsapp', profile.phone), kv('linkedin', profile.linkedin), kv('github', profile.github))
        break
      case 'neofetch':
        push(
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            <pre className="text-accent">{ASCII}</pre>
            <div className="flex flex-col">
              <span>
                <span className="text-success">dylane</span>@<span className="text-success">portfolio</span>
              </span>
              <span className="text-faint">-----------------</span>
              {kv('OS', 'dylane.os 5.0 (Douala)')}
              {kv('Uptime', lang === 'fr' ? "5+ ans d'expérience" : '5+ years of experience')}
              {kv('Shell', 'bash')}
              {kv('Frontend', 'Angular · React · Next.js')}
              {kv('Backend', 'Laravel · Django · Spring')}
              {kv('Theme', theme)}
              {kv('Locale', lang)}
              <span className="mt-1 flex gap-1" aria-hidden="true">
                {['bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-cyan-400', 'bg-accent', 'bg-accent-2'].map((c) => (
                  <span key={c} className={`h-3 w-5 ${c}`} />
                ))}
              </span>
            </div>
          </div>,
        )
        break
      case 'cv': {
        push(t.terminal.opening)
        const a = document.createElement('a')
        a.href = profile.cv
        a.download = ''
        a.click()
        break
      }
      case 'theme': {
        const next = args[0]
        if (next !== 'dark' && next !== 'light') push(`${t.terminal.usage} theme dark | light`)
        else {
          setTheme(next)
          push(`${t.terminal.themeSet} ${next}`)
        }
        break
      }
      case 'lang': {
        const next = args[0]
        if (next !== 'fr' && next !== 'en') push(`${t.terminal.usage} lang fr | en`)
        else {
          setLang(next)
          push(`${t.terminal.langSet} ${next}`)
        }
        break
      }
      case 'goto':
      case 'cd': {
        const target = args[0]?.replace(/^[~/.]+/, '')
        if (!target || !SECTIONS.includes(target)) push(`${t.terminal.usage} goto ${SECTIONS.join(' | ')}`)
        else {
          onClose()
          setTimeout(() => scrollToId(target), 150)
        }
        break
      }
      case 'clear':
        setLines([])
        break
      case 'exit':
        onClose()
        break
      case 'sudo':
        push(<span className="text-amber-500">{t.terminal.sudo}</span>)
        break
      case 'rm':
        push(<span className="text-rose-500">{t.terminal.rm}</span>)
        break
      default:
        push(<span className="text-rose-500">{`${name}: ${t.terminal.notFound}`}</span>)
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input)
      if (input.trim()) setHistory((h) => [input, ...h].slice(0, 50))
      setInput('')
      setCursor(-1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(cursor + 1, history.length - 1)
      if (history[next] !== undefined) {
        setCursor(next)
        setInput(history[next])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = cursor - 1
      setCursor(Math.max(next, -1))
      setInput(next < 0 ? '' : history[next])
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const match = COMMANDS.find((c) => c.startsWith(input.trim().toLowerCase()))
      if (match && input.trim()) setInput(match + ' ')
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  // Piège le focus dans la boîte de dialogue
  const onDialogKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') onClose()
    if (e.key !== 'Tab' || e.target === inputRef.current) return
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button, input')
    if (!focusables?.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.terminal.title}
            onKeyDown={onDialogKeyDown}
            initial={{ opacity: 0, y: 30, scale: 0.96, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            style={{ transformPerspective: 1200 }}
            className="relative flex h-[min(78vh,560px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b13]/95 font-mono text-[13px] text-[#e6e6f0] shadow-2xl [--accent:#8f80ff] [--accent-2:#b18cff] [--muted:#a3a3bb] [--faint:#7d7d96] [--success:#34d399]"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="size-3 rounded-full bg-rose-400/80" aria-hidden="true" />
              <span className="size-3 rounded-full bg-amber-400/80" aria-hidden="true" />
              <span className="size-3 rounded-full bg-emerald-400/80" aria-hidden="true" />
              <p className="flex-1 text-center text-xs text-[#7d7d96]">{t.terminal.title}</p>
              <span className="hidden text-[11px] text-[#7d7d96] sm:inline">{t.terminal.hint}</span>
              <button type="button" onClick={onClose} className="grid size-8 cursor-pointer place-items-center rounded-md text-[#a3a3bb] hover:bg-white/10 hover:text-white" aria-label="Close">
                <X className="size-4" />
              </button>
            </div>
            <div ref={bodyRef} data-lenis-prevent className="flex-1 space-y-1 overflow-y-auto p-4 leading-relaxed whitespace-pre-wrap" aria-live="polite">
              {lines.map((l) => (
                <div key={l.id}>{l.content}</div>
              ))}
              <div className="flex items-center gap-2">
                <span className="shrink-0">
                  <span className="text-success">dylane@portfolio</span>:<span className="text-accent">~</span>$
                </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="flex-1 bg-transparent text-[#e6e6f0] caret-[#8f80ff] outline-none focus-visible:outline-none"
                  aria-label="command"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
