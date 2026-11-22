export interface MissionInfo {
  id: string;
  slug: string;
  num: string;
  title: string;
  desc: string;
  emoji: string;
  tint: string;
  accent: string;
  topic: string;
  isTest?: boolean;
}

export const MISSIONS: MissionInfo[] = [
  {
    id: 'eclipses',
    slug: 'eclipses',
    num: '01',
    title: 'Eclipses',
    desc: 'Cuando la luz juega a las escondidas',
    emoji: '🌘',
    tint: 'text-cyan-300',
    accent: '#67e8f9',
    topic: 'Pregunta 1a',
  },
  {
    id: 'meteoros',
    slug: 'estrellas-fugaces',
    num: '02',
    title: 'Estrellas fugaces',
    desc: 'Deseos que cruzan la atmósfera',
    emoji: '☄️',
    tint: 'text-amber-300',
    accent: '#fcd34d',
    topic: 'Pregunta 1b',
  },
  {
    id: 'luz',
    slug: 'velocidad-de-la-luz',
    num: '03',
    title: 'Velocidad de la luz',
    desc: 'El límite de velocidad del universo',
    emoji: '⚡',
    tint: 'text-yellow-200',
    accent: '#fde047',
    topic: 'Pregunta 1c',
  },
  {
    id: 'luna',
    slug: 'luna-y-mareas',
    num: '04',
    title: 'La Luna y las mareas',
    desc: 'Nuestra vecina mueve los océanos',
    emoji: '🌕',
    tint: 'text-slate-200',
    accent: '#e2e8f0',
    topic: 'Preguntas 2a · 2b · 2c',
  },
  {
    id: 'danza',
    slug: 'danza-cosmica',
    num: '05',
    title: 'La danza cósmica',
    desc: 'Sol, Tierra y Luna en movimiento',
    emoji: '🌍',
    tint: 'text-sky-300',
    accent: '#7dd3fc',
    topic: 'Punto 3',
  },
  {
    id: 'sistema-solar',
    slug: 'sistema-solar',
    num: '06',
    title: 'El sistema solar',
    desc: 'Ocho planetas en orden de salida',
    emoji: '🪐',
    tint: 'text-orange-300',
    accent: '#fdba74',
    topic: 'Punto 4',
  },
  {
    id: 'estrellas',
    slug: 'estrellas-fijas',
    num: '07',
    title: 'Estrellas fijas',
    desc: 'Cinco puntos brillantes con nombre',
    emoji: '✨',
    tint: 'text-indigo-200',
    accent: '#c7d2fe',
    topic: 'Punto 5',
  },
  {
    id: 'constelaciones',
    slug: 'constelaciones',
    num: '08',
    title: 'Constelaciones',
    desc: 'Dibujos, mitos y brújulas del cielo',
    emoji: '🌌',
    tint: 'text-violet-300',
    accent: '#c4b5fd',
    topic: 'Puntos 6 y 7',
  },
  {
    id: 'via-lactea',
    slug: 'via-lactea',
    num: '09',
    title: 'Vía Láctea',
    desc: 'El río de estrellas donde vivimos',
    emoji: '🌠',
    tint: 'text-fuchsia-300',
    accent: '#f0abfc',
    topic: 'Punto 8',
  },
  {
    id: 'lucero',
    slug: 'lucero-venus',
    num: '10',
    title: 'El lucero',
    desc: 'Venus, la estrella que no era estrella',
    emoji: '🌟',
    tint: 'text-amber-200',
    accent: '#fde68a',
    topic: 'Punto 9',
  },
  {
    id: 'cenit',
    slug: 'cenit-y-nadir',
    num: '11',
    title: 'Cenit y nadir',
    desc: 'El arriba y el abajo de tu cielo',
    emoji: '🧭',
    tint: 'text-teal-300',
    accent: '#5eead4',
    topic: 'Punto 10',
  },
];

export const FINAL_MISSION: MissionInfo = {
  id: 'quiz',
  slug: 'test-final',
  num: '★',
  title: 'Test final',
  desc: 'Demuestra que dominas el cosmos',
  emoji: '🚀',
  tint: 'text-pink-300',
  accent: '#f9a8d4',
  topic: 'Repaso final',
  isTest: true,
};

export const ALL_MISSIONS: MissionInfo[] = [...MISSIONS, FINAL_MISSION];
