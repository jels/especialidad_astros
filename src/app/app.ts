import { AfterViewInit, Component, HostListener, signal } from '@angular/core';
import { RevealDirective } from './directives/reveal';
import { Starfield } from './components/starfield';
import { EclipseLab } from './components/eclipse-lab';
import { MeteorShower } from './components/meteor-shower';
import { LightSpeed } from './components/light-speed';
import { MoonTides } from './components/moon-tides';
import { CosmicDance } from './components/cosmic-dance';
import { SolarSystem } from './components/solar-system';
import { FixedStars } from './components/fixed-stars';
import { Constellations } from './components/constellations';
import { MilkyWay } from './components/milky-way';
import { MorningStar } from './components/morning-star';
import { ZenithNadir } from './components/zenith-nadir';
import { SpaceQuiz } from './components/space-quiz';

interface NavItem {
  id: string;
  num: string;
  title: string;
  desc: string;
  emoji: string;
  tint: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RevealDirective,
    Starfield,
    EclipseLab,
    MeteorShower,
    LightSpeed,
    MoonTides,
    CosmicDance,
    SolarSystem,
    FixedStars,
    Constellations,
    MilkyWay,
    MorningStar,
    ZenithNadir,
    SpaceQuiz,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  protected readonly menuOpen = signal(false);
  protected readonly activeSection = signal('inicio');
  protected readonly progress = signal(0);
  protected readonly scrolled = signal(false);

  protected readonly navItems: NavItem[] = [
    {
      id: 'eclipses',
      num: '01',
      title: 'Eclipses',
      desc: 'Cuando la luz juega a las escondidas',
      emoji: '🌘',
      tint: 'text-cyan-300',
    },
    {
      id: 'meteoros',
      num: '02',
      title: 'Estrellas fugaces',
      desc: 'Deseos que cruzan la atmósfera',
      emoji: '☄️',
      tint: 'text-amber-300',
    },
    {
      id: 'luz',
      num: '03',
      title: 'Velocidad de la luz',
      desc: 'El límite de velocidad del universo',
      emoji: '⚡',
      tint: 'text-yellow-200',
    },
    {
      id: 'luna',
      num: '04',
      title: 'La Luna y las mareas',
      desc: 'Nuestra vecina mueve los océanos',
      emoji: '🌕',
      tint: 'text-slate-200',
    },
    {
      id: 'danza',
      num: '05',
      title: 'La danza cósmica',
      desc: 'Sol, Tierra y Luna en movimiento',
      emoji: '🌍',
      tint: 'text-sky-300',
    },
    {
      id: 'sistema-solar',
      num: '06',
      title: 'El sistema solar',
      desc: 'Ocho planetas en orden de salida',
      emoji: '🪐',
      tint: 'text-orange-300',
    },
    {
      id: 'estrellas',
      num: '07',
      title: 'Estrellas fijas',
      desc: 'Cinco puntos brillantes con nombre',
      emoji: '✨',
      tint: 'text-indigo-200',
    },
    {
      id: 'constelaciones',
      num: '08',
      title: 'Constelaciones',
      desc: 'Dibujos, mitos y brújulas del cielo',
      emoji: '🌌',
      tint: 'text-violet-300',
    },
    {
      id: 'via-lactea',
      num: '09',
      title: 'Vía Láctea',
      desc: 'El río de estrellas donde vivimos',
      emoji: '🌠',
      tint: 'text-fuchsia-300',
    },
    {
      id: 'lucero',
      num: '10',
      title: 'El lucero',
      desc: 'Venus, la estrella que no era estrella',
      emoji: '🌟',
      tint: 'text-amber-200',
    },
    {
      id: 'cenit',
      num: '11',
      title: 'Cenit y nadir',
      desc: 'El arriba y el abajo de tu cielo',
      emoji: '🧭',
      tint: 'text-teal-300',
    },
    {
      id: 'quiz',
      num: '★',
      title: 'Test final',
      desc: 'Demuestra que dominas el cosmos',
      emoji: '🚀',
      tint: 'text-pink-300',
    },
  ];

  protected readonly quickNav = [
    { id: 'eclipses', label: 'Eclipses' },
    { id: 'luna', label: 'La Luna' },
    { id: 'sistema-solar', label: 'Sistema solar' },
    { id: 'constelaciones', label: 'Constelaciones' },
    { id: 'via-lactea', label: 'Vía Láctea' },
  ];

  protected readonly tickerFacts = [
    '⚡ La luz viaja a 299.792 km/s',
    '🌕 La Luna está a 384.400 km de distancia',
    '☀️ La luz del Sol tarda 8 min 20 s en llegar',
    '🪐 El Sol concentra el 99,86 % de la masa del sistema solar',
    '🌌 La Vía Láctea tiene más de 100.000 años luz de diámetro',
    '✨ Las estrellas nacen, viven y mueren',
    '🪐 Un día en Venus dura más que un año venusino',
    '🌍 La Luna se aleja 3,8 cm cada año',
  ];

  protected readonly marqueeFacts = [...this.tickerFacts, ...this.tickerFacts];
  protected readonly footerPrimary = this.navItems.slice(0, 6);
  protected readonly footerSecondary = this.navItems.slice(6);

  private ticking = false;

  ngAfterViewInit(): void {
    this.updateScrollState();
  }

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.updateScrollState();
      this.ticking = false;
    });
  }

  @HostListener('window:keydown.escape')
  protected onEscape(): void {
    this.closeMenu();
  }

  private updateScrollState(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.progress.set(max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0);
    this.scrolled.set(scrollTop > 24);

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('main section[id]'),
    );
    let current = 'inicio';
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 160) {
        current = section.id;
      }
    }
    this.activeSection.set(current);
  }

  protected openMenu(): void {
    this.menuOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    document.body.style.overflow = '';
  }
}
