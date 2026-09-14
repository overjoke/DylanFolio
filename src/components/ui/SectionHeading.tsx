import { Reveal } from './Reveal'
import { ScrambleText } from './ScrambleText'

interface Props {
  number: string
  index: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ number, index, title, subtitle, align = 'left' }: Props) {
  const center = align === 'center'
  return (
    <Reveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'}>
      <p className={`flex items-center gap-3 font-mono text-xs tracking-widest text-accent uppercase ${center ? 'justify-center' : ''}`}>
        <span className="text-faint">{number}</span>
        <span className="h-px w-8 bg-gradient-to-r from-accent to-transparent" aria-hidden="true" />
        <ScrambleText text={index} />
      </p>
      <h2 className="mt-4 font-display text-3xl leading-[1.1] font-semibold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-5 text-lg text-pretty text-muted">{subtitle}</p>}
    </Reveal>
  )
}
