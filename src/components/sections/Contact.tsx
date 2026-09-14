import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, CheckCircle2, Loader2, Mail, MapPin, Send, TriangleAlert } from 'lucide-react'
import { useI18n } from '../../i18n/LanguageProvider'
import { profile } from '../../data/profile'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { GithubIcon, LinkedinIcon, WhatsappIcon } from '../ui/Icons'

type Status = 'idle' | 'sending' | 'success' | 'error'
type Topic = 'hiring' | 'freelance' | 'other'

const encode = (data: Record<string, string>) =>
  Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')

export function Contact() {
  const { t } = useI18n()
  const f = t.contact.form
  const [status, setStatus] = useState<Status>('idle')
  const [topic, setTopic] = useState<Topic>('freelance')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const channels = [
    { icon: Mail, label: t.contact.channels.email, value: profile.email, href: `mailto:${profile.email}` },
    { icon: WhatsappIcon, label: t.contact.channels.whatsapp, value: profile.phone, href: profile.whatsapp },
    { icon: LinkedinIcon, label: t.contact.channels.linkedin, value: 'in/dylanehengla', href: profile.linkedin },
    { icon: GithubIcon, label: t.contact.channels.github, value: `@${profile.githubHandle}`, href: profile.github },
  ]

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    delete data['topic-choice']

    const nextErrors: Record<string, string> = {}
    if (!data.name?.trim()) nextErrors.name = f.required
    if (!data.email?.trim()) nextErrors.email = f.required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) nextErrors.email = f.invalidEmail
    if (!data.message?.trim()) nextErrors.message = f.required
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus()
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...data, topic: f.topics[topic] }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  const field =
    'w-full rounded-xl border bg-bg px-4 py-3 text-base text-ink placeholder:text-faint transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-soft'

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
          <div>
            <SectionHeading number="08" index={t.contact.index} title={t.contact.title} subtitle={t.contact.subtitle} />

            <Reveal delay={0.1}>
              <ul className="mt-10 divide-y divide-line border-y border-line">
                {channels.map(({ icon: Icon, label, value, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith('mailto') ? undefined : '_blank'}
                      rel="noreferrer"
                      className="group flex cursor-pointer items-center gap-4 py-4"
                    >
                      <span className="grid size-10 place-items-center rounded-lg border border-line text-muted transition-colors duration-200 group-hover:border-accent group-hover:text-accent">
                        <Icon className="size-[18px]" />
                      </span>
                      <span className="flex-1">
                        <span className="block font-mono text-[11px] tracking-widest text-faint uppercase">{label}</span>
                        <span className="block text-ink">{value}</span>
                      </span>
                      <ArrowUpRight className="size-4 text-faint transition-all duration-300 group-hover:rotate-45 group-hover:text-accent" />
                    </a>
                  </li>
                ))}
                <li className="flex items-center gap-4 py-4">
                  <span className="grid size-10 place-items-center rounded-lg border border-line text-muted">
                    <MapPin className="size-[18px]" />
                  </span>
                  <span>
                    <span className="block font-mono text-[11px] tracking-widest text-faint uppercase">{t.contact.channels.location}</span>
                    <span className="block text-ink">{t.contact.channels.locationValue}</span>
                  </span>
                </li>
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={onSubmit}
              noValidate
              className="glass relative rounded-3xl p-6 sm:p-9"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p hidden>
                <label>
                  Bot <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
              </p>

              <fieldset>
                <legend className="text-sm font-medium text-ink">{f.topic}</legend>
                <div className="mt-2.5 grid grid-cols-3 gap-1 rounded-xl border border-line bg-bg p-1">
                  {(Object.keys(f.topics) as Topic[]).map((key) => (
                    <label key={key} className="relative cursor-pointer">
                      <input type="radio" name="topic-choice" value={key} checked={topic === key} onChange={() => setTopic(key)} className="peer sr-only" />
                      {topic === key && (
                        <motion.span layoutId="topic-pill" className="absolute inset-0 rounded-lg bg-accent" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                      )}
                      <span
                        className={`relative block rounded-lg px-2 py-2.5 text-center text-sm transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent ${
                          topic === key ? 'font-medium text-white' : 'text-muted hover:text-ink'
                        }`}
                      >
                        {f.topics[key]}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {(['name', 'email'] as const).map((name) => (
                  <div key={name}>
                    <label htmlFor={`c-${name}`} className="text-sm font-medium text-ink">
                      {f[name]}
                    </label>
                    <input
                      id={`c-${name}`}
                      name={name}
                      type={name === 'email' ? 'email' : 'text'}
                      autoComplete={name}
                      placeholder={name === 'email' ? f.emailPh : f.namePh}
                      aria-invalid={!!errors[name]}
                      aria-describedby={errors[name] ? `c-${name}-err` : undefined}
                      className={`${field} mt-2 ${errors[name] ? 'border-rose-500' : 'border-line'}`}
                    />
                    {errors[name] && (
                      <p id={`c-${name}-err`} className="mt-1.5 text-sm text-rose-600 dark:text-rose-400">
                        {errors[name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <label htmlFor="c-message" className="text-sm font-medium text-ink">
                  {f.message}
                </label>
                <textarea
                  id="c-message"
                  name="message"
                  rows={5}
                  placeholder={f.messagePh}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'c-message-err' : undefined}
                  data-lenis-prevent
                  className={`${field} mt-2 resize-y ${errors.message ? 'border-rose-500' : 'border-line'}`}
                />
                {errors.message && (
                  <p id="c-message-err" className="mt-1.5 text-sm text-rose-600 dark:text-rose-400">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group inline-flex h-12 cursor-pointer sm:flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 font-medium text-white transition-opacity duration-200 hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> {f.sending}
                    </>
                  ) : (
                    <>
                      {f.send} <Send className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
                <a
                  href={profile.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-line px-6 font-medium text-ink transition-colors duration-200 hover:border-[#25D366] hover:text-[#128C7E] dark:hover:text-[#25D366]"
                >
                  <WhatsappIcon className="size-4" /> {t.contact.whatsappCta}
                </a>
              </div>

              <div aria-live="polite">
                <AnimatePresence>
                  {status === 'success' && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-5 flex items-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-sm text-success"
                    >
                      <CheckCircle2 className="size-4 shrink-0" /> {f.success}
                    </motion.p>
                  )}
                  {status === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-5 flex items-start gap-2 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300"
                    >
                      <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                      <span>
                        {f.error}{' '}
                        <a href={`mailto:${profile.email}`} className="font-medium underline underline-offset-2">
                          {profile.email}
                        </a>
                      </span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
