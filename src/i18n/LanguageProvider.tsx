import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { translations, type Dict, type Lang } from './translations'

interface LanguageContextValue {
  lang: Lang
  t: Dict
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function initialLang(): Lang {
  const fromDom = document.documentElement.lang
  return fromDom === 'en' ? 'en' : 'fr'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem('dh-lang', next)
    } catch {
      /* stockage indisponible */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = translations[lang].meta.title
  }, [lang])

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, t: translations[lang], setLang, toggleLang: () => setLang(lang === 'fr' ? 'en' : 'fr') }),
    [lang, setLang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useI18n() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useI18n must be used inside LanguageProvider')
  return ctx
}
