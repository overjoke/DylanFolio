// Données indépendantes de la langue. Les textes traduits sont dans src/i18n/translations.ts

export const profile = {
  name: 'Dylane Hengla',
  fullName: 'Hengla Bamal Joseph Dylane',
  initials: 'DH',
  email: 'dylanehengla@gmail.com',
  phone: '+237 692 644 493',
  whatsapp: 'https://wa.me/237692644493',
  github: 'https://github.com/overjoke',
  githubHandle: 'overjoke',
  linkedin: 'https://linkedin.com/in/dylanehengla',
  cv: '/cv/CV_Dylane_Hengla.pdf',
  coords: '4.0511° N · 9.7679° E',
}

export type ProjectId = 'exms' | 'maneldocu' | 'beaute' | 'cvforger' | 'facturepro' | 'vintage'

export interface Project {
  id: ProjectId
  name: string
  stack: string[]
  live?: string
  code?: string
  /** Monogramme affiché sur la couverture */
  mark: string
  /** Teinte (degrés) de la couverture générative */
  hue: number
}

export const projects: Project[] = [
  { id: 'exms', mark: 'XM', name: 'e-XMS', stack: ['Angular', 'Laravel', 'MySQL'], hue: 250 },
  {
    id: 'vintage',
    mark: 'VA',
    name: 'Vintage Académie',
    stack: ['React', 'Node.js', 'PostgreSQL'],
    live: 'https://www.vintageacademie.com/',
    hue: 280,
  },
  {
    id: 'facturepro',
    mark: 'FP',
    name: 'FacturePro',
    stack: ['React', 'TypeScript', 'Tailwind'],
    live: 'https://myinvoice-maker.netlify.app/',
    code: 'https://github.com/overjoke/Invoice',
    hue: 200,
  },
  {
    id: 'cvforger',
    mark: 'CV',
    name: 'CV Forger',
    stack: ['HTML', 'CSS', 'JavaScript', 'IA'],
    live: 'https://fnecvforger.netlify.app/',
    code: 'https://github.com/overjoke/forge-cv',
    hue: 305,
  },
  { id: 'maneldocu', mark: 'MD', name: 'Manel Docu', stack: ['Laravel', 'MySQL'], hue: 230 },
  {
    id: 'beaute',
    mark: 'BN',
    name: 'Beauté Naturel',
    stack: ['React', 'TypeScript', 'Tailwind'],
    live: 'https://joker-style.netlify.app/',
    code: 'https://github.com/overjoke/coiffure-salon',
    hue: 330,
  },
]

export type SiteCategory = 'business' | 'ecommerce' | 'nonprofit' | 'portfolio'

export const clientSites: { name: string; url: string; category: SiteCategory; year: number }[] = [
  { name: 'GLC International', url: 'https://glc-international.com/', category: 'ecommerce', year: 2023 },
  { name: 'Manel Solutions Informatiques', url: 'https://manelcanada.ca/', category: 'business', year: 2023 },
  { name: 'Manel Recrutement', url: 'https://manelrecrutement.ca/', category: 'business', year: 2023 },
  { name: 'Impact Vert', url: 'https://impactvert.ca/', category: 'nonprofit', year: 2023 },
  { name: 'Momha Marie Gabriella', url: 'https://overjoke.github.io/momha-gabriella-portfolio/', category: 'portfolio', year: 2024 },
]

export type ExperienceId = 'cba' | 'vintage' | 'manel' | 'imv'

export const experience: { id: ExperienceId; company: string; period: [string, string | null]; stack: string[] }[] = [
  { id: 'cba', company: 'Certificate Body for Africa', period: ['2025-10', null], stack: ['Angular', 'REST API', 'Git'] },
  { id: 'vintage', company: 'Vintage Académie', period: ['2025-02', '2025-06'], stack: ['Next.js', 'WordPress', 'Elementor'] },
  { id: 'manel', company: 'MANEL Solutions Informatiques', period: ['2023-06', '2025-02'], stack: ['WordPress', 'Moodle', 'Dolibarr', 'SEO'] },
  { id: 'imv', company: 'IMV Afrique', period: ['2021', '2023'], stack: ['Angular', 'REST API', 'Git'] },
]

export const stackGroups: { key: 'front' | 'back' | 'data' | 'tools' | 'methods'; items: string[] }[] = [
  { key: 'front', items: ['Angular', 'React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Vue.js'] },
  { key: 'back', items: ['Laravel', 'PHP', 'Node.js', 'Django', 'Python', 'Spring Boot', 'REST API'] },
  { key: 'data', items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Supabase', 'Firebase'] },
  { key: 'tools', items: ['Git', 'Docker', 'Linux', 'WordPress', 'Moodle', 'Dolibarr', 'GLPI'] },
  { key: 'methods', items: ['UML', 'Merise', 'SEO', 'UI/UX'] },
]
