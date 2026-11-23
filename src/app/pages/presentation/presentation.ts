import { Component, HostListener, OnDestroy, computed, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConstellationDiagram } from '../../components/constellation-diagram';
import { CosmicDance } from '../../components/cosmic-dance';
import { EclipseLab } from '../../components/eclipse-lab';
import { FixedStars } from '../../components/fixed-stars';
import { MoonTides } from '../../components/moon-tides';
import { ConstellationData, CONSTELLATIONS } from '../../data/constellations';
import { PLANETS } from '../../data/planets';

type SlideId =
  | 'intro'
  | 'eclipses'
  | 'meteoros'
  | 'luz'
  | 'luna'
  | 'danza'
  | 'sistema'
  | 'estrellas'
  | 'constelaciones'
  | 'via-lactea'
  | 'venus'
  | 'cenit'
  | 'mito'
  | 'fin';

interface PresentationSlide {
  id: SlideId;
  label: string;
  kicker: string;
  title: string;
  subtitle: string;
  big: string;
  bigLabel: string;
  facts: string[];
}

interface Meteor {
  id: number;
  top: number;
  left: number;
  delay: number;
}

interface MythCard {
  statement: string;
  answer: 'MITO' | 'DATO';
  detail: string;
}

const SLIDES: PresentationSlide[] = [
  {
    id: 'intro',
    label: 'Portada',
    kicker: 'Cosmos 101',
    title: 'El cielo, en 12 paradas.',
    subtitle: 'Una presentación interactiva para proyectar y mirar el universo de otro modo.',
    big: '12',
    bigLabel: 'paradas visuales',
    facts: [
      '11 temas + 1 desafío',
      'Interactivos en cada parada',
      'Ideal para pizarra o proyector',
    ],
  },
  {
    id: 'eclipses',
    label: 'Eclipses',
    kicker: 'Misión 01 · Pregunta 1a',
    title: 'Eclipses',
    subtitle: 'Cuando la luz juega a las escondidas.',
    big: '5,1°',
    bigLabel: 'inclinación de la órbita lunar',
    facts: [
      'Eclipse solar: Luna entre Sol y Tierra.',
      'Eclipse lunar: Tierra entre Sol y Luna.',
      'Por la inclinación, no ocurre cada mes.',
    ],
  },
  {
    id: 'meteoros',
    label: 'Meteoros',
    kicker: 'Misión 02 · Pregunta 1b',
    title: 'Estrellas fugaces',
    subtitle: 'No son estrellas: son rocas que se encienden en la atmósfera.',
    big: '11–72',
    bigLabel: 'km/s al entrar en la atmósfera',
    facts: [
      'Brillan a unos 80–120 km de altura.',
      'La mayoría son granos de arena o polvo.',
      'Si sobrevive y llega al suelo: meteorito.',
    ],
  },
  {
    id: 'luz',
    label: 'Luz',
    kicker: 'Misión 03 · Pregunta 1c',
    title: 'Velocidad de la luz',
    subtitle: 'El límite de velocidad del universo.',
    big: '299.792.458',
    bigLabel: 'metros por segundo en el vacío',
    facts: [
      'Da 7,5 vueltas a la Tierra en 1 segundo.',
      'Del Sol a la Tierra tarda 8 min 20 s.',
      'Un año luz mide distancia: 9,46 billones de km.',
    ],
  },
  {
    id: 'luna',
    label: 'Luna',
    kicker: 'Misión 04 · Preguntas 2a–2c',
    title: 'La Luna y las mareas',
    subtitle: 'Nuestra vecina mueve los océanos.',
    big: '384.400',
    bigLabel: 'kilómetros de distancia media',
    facts: [
      'Entre la Tierra y la Luna caben unas 30 Tierras.',
      'Su gravedad forma dos bultos de agua opuestos.',
      'Sol y Luna alineados producen mareas vivas.',
    ],
  },
  {
    id: 'danza',
    label: 'Órbitas',
    kicker: 'Misión 05 · Punto 3',
    title: 'La danza cósmica',
    subtitle: 'Tres cuerpos, tres movimientos, un mismo compás.',
    big: '27,3',
    bigLabel: 'días por órbita de la Luna',
    facts: [
      'La Tierra rota en 23 h 56 min.',
      'La Tierra tarda 365,25 días en orbitar.',
      'El eje terrestre está inclinado 23,5°.',
    ],
  },
  {
    id: 'sistema',
    label: 'Planetas',
    kicker: 'Misión 06 · Punto 4',
    title: 'El sistema solar',
    subtitle: 'Ocho vecinos, una misma estrella.',
    big: '8',
    bigLabel: 'planetas en orden desde el Sol',
    facts: [
      'Rocosos: Mercurio, Venus, Tierra, Marte.',
      'Gigantes: Júpiter, Saturno, Urano, Neptuno.',
      'El Sol concentra el 99,86 % de la masa.',
    ],
  },
  {
    id: 'estrellas',
    label: 'Estrellas',
    kicker: 'Misión 07 · Punto 5',
    title: 'Cinco estrellas fijas',
    subtitle: 'Puntos brillantes con nombre propio.',
    big: '5',
    bigLabel: 'estrellas fáciles de identificar',
    facts: [
      'Sirio es la más brillante del cielo nocturno.',
      'Alfa Centauri está a 4,37 años luz.',
      'Las estrellas emiten luz; los planetas la reflejan.',
    ],
  },
  {
    id: 'constelaciones',
    label: 'Constelaciones',
    kicker: 'Misión 08 · Puntos 6 y 7',
    title: 'Constelaciones',
    subtitle: 'Dibujos que ayudan a orientarse en el cielo.',
    big: '88',
    bigLabel: 'constelaciones oficiales',
    facts: [
      'Sus estrellas pueden estar a distancias enormes.',
      'Cruz del Sur y Centauro se ven todo el año en el sur.',
      'Orión, Escorpio y Sagitario destacan en el cielo.',
    ],
  },
  {
    id: 'via-lactea',
    label: 'Galaxia',
    kicker: 'Misión 09 · Punto 8',
    title: 'La Vía Láctea',
    subtitle: 'El río de estrellas donde vivimos.',
    big: '100.000',
    bigLabel: 'años luz de diámetro aproximado',
    facts: [
      'Es nuestra galaxia vista desde dentro.',
      'El Sol está a unos 26.000 años luz del centro.',
      'Mejor observarla lejos de la contaminación lumínica.',
    ],
  },
  {
    id: 'venus',
    label: 'Venus',
    kicker: 'Misión 10 · Punto 9',
    title: 'Venus, el lucero',
    subtitle: 'La estrella que nunca fue una estrella.',
    big: '47°',
    bigLabel: 'separación máxima del Sol en nuestro cielo',
    facts: [
      'Es un planeta, no una estrella.',
      'Se ve antes del amanecer o después del atardecer.',
      'Es el objeto más brillante después del Sol y la Luna.',
    ],
  },
  {
    id: 'cenit',
    label: 'Cielo local',
    kicker: 'Misión 11 · Punto 10',
    title: 'Cenit y nadir',
    subtitle: 'El arriba y el abajo de tu cielo.',
    big: '90° / −90°',
    bigLabel: 'altura del cenit y del nadir',
    facts: [
      'El cenit está justo sobre tu cabeza.',
      'El nadir está en la dirección opuesta, bajo tus pies.',
      'Ambos cambian cuando te mueves de lugar.',
    ],
  },
  {
    id: 'mito',
    label: 'Repaso',
    kicker: 'Ronda rápida',
    title: 'Mito o dato',
    subtitle: 'Toca cada tarjeta y revela la respuesta con el grupo.',
    big: '4',
    bigLabel: 'afirmaciones para votar',
    facts: [
      'Pide al público que vote antes de revelar.',
      'Cada tarjeta da una explicación breve.',
      'Ideal para cerrar la presentación.',
    ],
  },
  {
    id: 'fin',
    label: 'Cierre',
    kicker: 'Fin de la transmisión',
    title: 'El universo no está lejos.',
    subtitle: 'Empieza a 1,3 segundos de distancia.',
    big: '∞',
    bigLabel: 'curiosidad',
    facts: ['Mira arriba', 'Haz preguntas', 'Sigue explorando'],
  },
];

@Component({
  selector: 'app-presentation',
  imports: [RouterLink, ConstellationDiagram, CosmicDance, EclipseLab, FixedStars, MoonTides],
  templateUrl: './presentation.html',
  styleUrl: './presentation.css',
})
export class Presentation implements OnDestroy {
  protected readonly slides = SLIDES;
  protected readonly total = SLIDES.length;
  protected readonly current = signal(0);
  protected readonly slide = computed(() => SLIDES[this.current()]);
  protected readonly isFullscreen = signal(false);
  protected readonly progress = computed(() => ((this.current() + 1) / this.total) * 100);

  // Meteoros
  protected readonly meteors = signal<Meteor[]>([]);
  protected readonly meteorCount = signal(0);
  protected readonly meteorPlaying = signal(true);
  private meteorId = 0;
  private meteorTimer?: number;
  private autoMeteorTimer?: number;
  protected readonly skyStars = Array.from({ length: 56 }, (_, i) => ({
    x: (Math.sin(i * 89.3 + 1.8) * 0.5 + 0.5) * 100,
    y: (Math.sin(i * 213.7 + 4.1) * 0.5 + 0.5) * 80,
    size: 1 + ((i * 7) % 10) / 7,
    opacity: 0.25 + ((i * 11) % 10) / 16,
  }));

  // Luz
  protected readonly destinations = [
    { name: 'la Luna', emoji: '🌕', distance: 384_400 },
    { name: 'el Sol', emoji: '☀️', distance: 149_600_000 },
    { name: 'Marte', emoji: '🔴', distance: 225_000_000 },
  ];
  protected readonly destinationIndex = signal(0);
  protected readonly lightPlaying = signal(true);
  protected readonly destination = computed(() => this.destinations[this.destinationIndex()]);
  protected readonly lightTime = computed(() =>
    this.formatTime(this.destination().distance / 299_792),
  );

  // Sistema solar
  protected readonly planets = PLANETS;
  protected readonly selectedPlanetId = signal('tierra');
  protected readonly solarPlaying = signal(true);
  protected readonly planetModalOpen = signal(false);
  protected readonly scaleMode = signal(false);
  protected readonly selectedPlanet = computed(
    () => this.planets.find((planet) => planet.id === this.selectedPlanetId()) ?? this.planets[2],
  );
  protected readonly selectedPlanetIndex = computed(() =>
    this.planets.findIndex((planet) => planet.id === this.selectedPlanetId()),
  );
  protected readonly solarAngles = signal(this.planets.map((planet) => planet.startAngle));
  protected readonly solarSpeeds = this.planets.map(
    (planet) => 0.27 / Math.pow(planet.orbitRx / 100, 0.55),
  );
  protected readonly solarBodies = computed(() =>
    this.planets.map((planet, index) => {
      const angle = this.solarAngles()[index];
      return {
        ...planet,
        x: 500 + Math.cos(angle) * planet.orbitRx,
        y: 325 + Math.sin(angle) * planet.orbitRx * 0.38,
      };
    }),
  );
  protected readonly planetRatios: Record<string, number> = {
    mercurio: 0.383,
    venus: 0.949,
    tierra: 1,
    marte: 0.532,
    jupiter: 11.209,
    saturno: 9.449,
    urano: 3.981,
    neptuno: 3.883,
  };
  protected readonly scaleGiants = this.planets.filter((planet) =>
    ['jupiter', 'saturno', 'urano', 'neptuno'].includes(planet.id),
  );
  protected readonly scaleRocky = this.planets.filter((planet) =>
    ['tierra', 'venus', 'marte', 'mercurio'].includes(planet.id),
  );

  // Constelaciones
  protected readonly constellations = CONSTELLATIONS;
  protected readonly constellationIndex = signal(0);
  protected readonly constellationPlaying = signal(true);
  protected readonly constellation = computed<ConstellationData>(
    () => this.constellations[this.constellationIndex()] ?? this.constellations[0],
  );
  protected readonly constellationItems = computed(() => [this.constellation()]);

  // Vía Láctea
  protected readonly milkyView = signal<'cielo' | 'galaxia'>('cielo');
  protected readonly pollution = signal(18);
  protected readonly milkyOpacity = computed(() => Math.max(0, 1 - this.pollution() / 82));
  protected readonly starOpacity = computed(() => Math.max(0.08, 1 - this.pollution() / 72));
  protected readonly milkyStars = Array.from({ length: 90 }, (_, i) => ({
    x: (Math.sin(i * 67.3 + 2.1) * 0.5 + 0.5) * 100,
    y: (Math.sin(i * 153.7 + 1.2) * 0.5 + 0.5) * 78,
    size: 0.6 + ((i * 7) % 10) / 10,
    opacity: 0.2 + ((i * 13) % 10) / 18,
  }));
  protected readonly galaxyDots = Array.from({ length: 340 }, (_, i) => {
    const arm = i % 3;
    const t = ((i * 37) % 100) / 100;
    const radius = 30 + Math.pow(t, 0.78) * 188;
    const jitter = (((i * 53) % 100) / 100 - 0.5) * 0.42;
    const angle = arm * ((Math.PI * 2) / 3) + radius * 0.026 + jitter;
    return {
      x: 450 + Math.cos(angle) * radius,
      y: 280 + Math.sin(angle) * radius * 0.86,
      r: 0.5 + ((i * 17) % 12) / 10,
      opacity: 0.3 + ((i * 29) % 10) / 14,
      tint: i % 13 === 0 ? '#f9a8d4' : i % 9 === 0 ? '#a5f3fc' : '#e2e8f0',
    };
  });
  protected readonly galaxyArms = [0, 1, 2].map((arm) => {
    let d = '';
    for (let radius = 35; radius <= 218; radius += 9) {
      const angle = arm * ((Math.PI * 2) / 3) + radius * 0.026;
      d += `${radius === 35 ? 'M' : 'L'} ${(450 + Math.cos(angle) * radius).toFixed(1)} ${(280 + Math.sin(angle) * radius * 0.86).toFixed(1)} `;
    }
    return { d, color: ['#8b5cf6', '#22d3ee', '#f0abfc'][arm] };
  });
  protected readonly galaxySun = (() => {
    const angle = 2.45;
    const radius = 148;
    return {
      x: 450 + Math.cos(angle) * radius,
      y: 280 + Math.sin(angle) * radius * 0.86,
    };
  })();

  // Venus
  protected readonly venusMode = signal<'amanecer' | 'atardecer'>('amanecer');
  protected readonly venusTime = signal(28);
  protected readonly venusPlaying = signal(true);
  protected readonly venusAltitude = computed(() =>
    this.venusMode() === 'amanecer' ? -18 + this.venusTime() * 0.36 : 18 - this.venusTime() * 0.36,
  );
  protected readonly venusDaylight = computed(() =>
    Math.max(0, Math.min(1, (this.venusAltitude() - 1) / 13)),
  );
  protected readonly venusNight = computed(() =>
    Math.max(0.05, Math.min(1, (1 - this.venusAltitude()) / 15)),
  );
  protected readonly venusTwilight = computed(() =>
    Math.max(0, Math.min(0.95, 1 - Math.abs(this.venusAltitude()) / 17)),
  );
  protected readonly venusOpacity = computed(() =>
    Math.max(0.05, Math.min(1, 1 - this.venusDaylight() * 1.28)),
  );
  protected readonly venusSunBottom = computed(() => 4 + ((this.venusAltitude() + 18) / 36) * 54);
  protected readonly venusVisible = computed(() => this.venusDaylight() < 0.55);

  // Cenit y nadir
  protected readonly altitude = signal(55);
  protected readonly zenithPlaying = signal(true);
  protected readonly zenithMarkerY = computed(
    () => 220 - Math.sin((this.altitude() * Math.PI) / 180) * 160,
  );
  protected readonly zenithLabel = computed(() =>
    this.altitude() > 0
      ? 'Sobre el horizonte'
      : this.altitude() < 0
        ? 'Bajo el horizonte'
        : 'Horizonte',
  );

  // Mito o dato
  protected readonly myths: MythCard[] = [
    {
      statement: 'Una estrella fugaz es una estrella que se cae.',
      answer: 'MITO',
      detail: 'Es un meteoro: polvo o roca que se quema al entrar en la atmósfera.',
    },
    {
      statement: 'La luz que vemos del Sol salió hace unos 8 minutos.',
      answer: 'DATO',
      detail: 'La luz tarda unos 8 min 20 s en recorrer los 149,6 millones de km.',
    },
    {
      statement: 'La Luna es la principal responsable de las mareas.',
      answer: 'DATO',
      detail: 'Su gravedad deforma los océanos. El Sol también suma, pero menos.',
    },
    {
      statement: 'Venus es una estrella porque brilla muchísimo.',
      answer: 'MITO',
      detail: 'Venus es un planeta que refleja la luz del Sol. No produce luz propia.',
    },
  ];
  protected readonly revealedMyths = signal([false, false, false, false]);

  // Swipe
  private pointerStartX = 0;
  private pointerStartY = 0;
  private solarFrame?: number;
  private venusTimer?: number;
  private zenithTimer?: number;
  private constellationTimer?: number;
  private zenithDirection = 1;

  constructor() {
    effect(() => {
      const id = this.slide().id;
      const meteor = this.meteorPlaying();
      const solar = this.solarPlaying();
      const modal = this.planetModalOpen();
      const scale = this.scaleMode();
      const venus = this.venusPlaying();
      const zenith = this.zenithPlaying();
      const constellation = this.constellationPlaying();

      this.stopAutoLoops();

      if (id === 'meteoros' && meteor) this.startMeteorLoop();
      if (id === 'sistema' && solar && !modal && !scale) this.startSolarLoop();
      if (id === 'venus' && venus) this.startVenusLoop();
      if (id === 'cenit' && zenith) this.startZenithLoop();
      if (id === 'constelaciones' && constellation) this.startConstellationLoop();
    });
  }

  protected pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  protected goTo(index: number): void {
    this.current.set(Math.max(0, Math.min(this.total - 1, index)));
    this.resetAutoplay();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  private resetAutoplay(): void {
    switch (this.slide().id) {
      case 'meteoros':
        this.meteorPlaying.set(true);
        this.meteorCount.set(0);
        this.meteors.set([]);
        break;
      case 'luz':
        this.lightPlaying.set(true);
        break;
      case 'sistema':
        this.solarPlaying.set(true);
        this.planetModalOpen.set(false);
        this.scaleMode.set(false);
        this.selectedPlanetId.set('tierra');
        break;
      case 'constelaciones':
        this.constellationIndex.set(0);
        this.constellationPlaying.set(true);
        break;
      case 'via-lactea':
        this.milkyView.set('cielo');
        this.pollution.set(18);
        break;
      case 'venus':
        this.venusPlaying.set(true);
        this.venusMode.set('amanecer');
        this.venusTime.set(28);
        break;
      case 'cenit':
        this.zenithPlaying.set(true);
        this.altitude.set(55);
        this.zenithDirection = 1;
        break;
    }
  }

  private stopAutoLoops(): void {
    if (this.autoMeteorTimer) window.clearInterval(this.autoMeteorTimer);
    this.autoMeteorTimer = undefined;
    if (this.solarFrame) cancelAnimationFrame(this.solarFrame);
    this.solarFrame = undefined;
    if (this.venusTimer) window.clearInterval(this.venusTimer);
    this.venusTimer = undefined;
    if (this.zenithTimer) window.clearInterval(this.zenithTimer);
    this.zenithTimer = undefined;
    if (this.constellationTimer) window.clearInterval(this.constellationTimer);
    this.constellationTimer = undefined;
    if (this.meteorTimer) window.clearTimeout(this.meteorTimer);
    this.meteorTimer = undefined;
    this.meteors.set([]);
  }

  private startMeteorLoop(): void {
    this.launchMeteor();
    this.autoMeteorTimer = window.setInterval(() => this.launchMeteor(), 2600);
  }

  private startConstellationLoop(): void {
    this.constellationTimer = window.setInterval(() => {
      this.constellationIndex.update((index) => (index + 1) % this.constellations.length);
    }, 6000);
  }

  private startSolarLoop(): void {
    let last = performance.now();
    const tick = (time: number) => {
      const delta = Math.min(time - last, 50);
      last = time;
      this.solarAngles.update((angles) =>
        angles.map((angle, index) => angle + delta * 0.001 * this.solarSpeeds[index]),
      );
      this.solarFrame = requestAnimationFrame(tick);
    };
    this.solarFrame = requestAnimationFrame(tick);
  }

  private startVenusLoop(): void {
    this.venusTimer = window.setInterval(() => {
      this.venusTime.update((time) => {
        const next = time + 0.8;
        return next > 100 ? 0 : next;
      });
    }, 100);
  }

  private startZenithLoop(): void {
    this.zenithTimer = window.setInterval(() => {
      this.altitude.update((value) => {
        let next = value + this.zenithDirection * 0.7;
        if (next >= 90) {
          next = 90;
          this.zenithDirection = -1;
        } else if (next <= -90) {
          next = -90;
          this.zenithDirection = 1;
        }
        return Math.round(next);
      });
    }, 80);
  }

  protected next(): void {
    this.goTo(this.current() + 1);
  }

  protected prev(): void {
    this.goTo(this.current() - 1);
  }

  protected restart(): void {
    this.goTo(0);
  }

  protected toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  @HostListener('document:fullscreenchange')
  protected onFullscreenChange(): void {
    this.isFullscreen.set(!!document.fullscreenElement);
  }

  @HostListener('window:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    const tag = (event.target as HTMLElement | null)?.tagName ?? '';
    const isFormField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag);
    const isButton = ['BUTTON', 'A'].includes(tag);

    if (event.key === 'f' || event.key === 'F') {
      this.toggleFullscreen();
      return;
    }

    if (isFormField) return;

    if (event.key === ' ') {
      if (isButton) return;
      event.preventDefault();
      this.next();
      return;
    }

    if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(event.key)) {
      event.preventDefault();
      this.next();
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      this.prev();
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.goTo(this.total - 1);
    }
  }

  protected startSwipe(event: PointerEvent): void {
    this.pointerStartX = event.clientX;
    this.pointerStartY = event.clientY;
  }

  protected endSwipe(event: PointerEvent): void {
    const dx = event.clientX - this.pointerStartX;
    const dy = event.clientY - this.pointerStartY;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) this.next();
      else this.prev();
    }
  }

  protected launchMeteor(): void {
    if (this.meteorTimer) window.clearTimeout(this.meteorTimer);
    const base = ++this.meteorId;
    const next = Array.from({ length: 3 }, (_, i) => ({
      id: base + i,
      top: 8 + Math.random() * 38,
      left: 18 + Math.random() * 46,
      delay: i * 130,
    }));
    this.meteors.set(next);
    this.meteorCount.update((count) => count + 1);
    this.meteorTimer = window.setTimeout(() => this.meteors.set([]), 1500);
  }

  protected toggleScale(): void {
    this.scaleMode.update((value) => !value);
    this.planetModalOpen.set(false);
    this.solarPlaying.set(!this.scaleMode());
  }

  protected solarOrbitPath(planet: (typeof PLANETS)[number]): string {
    const rx = planet.orbitRx;
    const ry = planet.orbitRx * 0.38;
    return `M ${500 - rx} 325 a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`;
  }

  protected planetImage(id: string): string {
    return `planets/${id}.jpg`;
  }

  protected formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds.toFixed(2).replace('.', ',')} s`;
    const minutes = Math.floor(seconds / 60);
    const rest = Math.round(seconds % 60);
    return `${minutes} min ${rest} s`;
  }

  protected selectPlanet(id: string): void {
    this.selectedPlanetId.set(id);
    this.planetModalOpen.set(true);
  }

  protected closePlanetInfo(): void {
    this.planetModalOpen.set(false);
    this.solarPlaying.set(true);
  }

  protected setConstellation(index: number): void {
    this.constellationIndex.set(index);
    this.constellationPlaying.set(false);
  }

  protected setMilkyView(view: 'cielo' | 'galaxia'): void {
    this.milkyView.set(view);
  }

  protected setVenusMode(mode: 'amanecer' | 'atardecer'): void {
    this.venusMode.set(mode);
    this.venusTime.set(mode === 'amanecer' ? 28 : 72);
    this.venusPlaying.set(true);
  }

  protected toggleMyth(index: number): void {
    this.revealedMyths.update((items) => items.map((value, i) => (i === index ? !value : value)));
  }

  ngOnDestroy(): void {
    this.stopAutoLoops();
  }
}
