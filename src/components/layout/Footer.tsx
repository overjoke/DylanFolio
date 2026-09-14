import { ArrowUp } from 'lucide-react'
import { useI18n } from '../../i18n/LanguageProvider'
import { profile } from '../../data/profile'
import { scrollToId } from '../../lib/scroll'
import { GithubIcon, LinkedinIcon, WhatsappIcon } from '../ui/Icons'

export function Footer({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  const { t } = useI18n()
  const social = [
    { icon: GithubIcon, href: profile.github, label: 'GitHub' },
    { icon: LinkedinIcon, href: profile.linkedin, label: 'LinkedIn' },
    { icon: WhatsappIcon, href: profile.whatsapp, label: 'WhatsApp' },
  ]

  return (
    <footer className="relative border-t border-line">
      {/* Grand nom en filigrane */}
      <div aria-hidden="true" className="pointer-events-none overflow-hidden">
        <p className="container-x -mb-[0.2em] pt-16 text-center font-display text-[clamp(3.5rem,15vw,12rem)] leading-none font-bold tracking-[-0.06em] whitespace-nowrap text-transparent [-webkit-text-stroke:1px_var(--border-strong)]">
          dylane.dev
        </p>
      </div>
      <div className="container-x flex flex-col items-center justify-between gap-6 border-t border-line py-8 text-sm text-muted md:flex-row">
        <p>
          © {new Date().getFullYear()} · {t.footer.built}
        </p>
        <button type="button" onClick={onOpenTerminal} className="cursor-pointer font-mono text-xs text-faint transition-colors hover:text-accent">
          {t.footer.terminalHint} <kbd className="rounded border border-line bg-elev px-1.5 py-0.5 text-ink">Ctrl</kbd> +{' '}
          <kbd className="rounded border border-line bg-elev px-1.5 py-0.5 text-ink">K</kbd> {t.footer.terminalHint2}
        </button>
        <div className="flex items-center gap-1">
          {social.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="grid size-10 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-accent-soft hover:text-ink"
            >
              <Icon className="size-4" />
            </a>
          ))}
          <button
            type="button"
            onClick={() => scrollToId('top')}
            aria-label={t.footer.top}
            className="ml-2 grid size-10 cursor-pointer place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  )
}
