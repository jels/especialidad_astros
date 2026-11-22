import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  computed,
  signal,
} from '@angular/core';
import { RevealDirective } from '../directives/reveal';

type Alignment = 'solar' | 'lunar' | 'none';

@Component({
  selector: 'app-cosmic-dance',
  imports: [RevealDirective],
  templateUrl: './cosmic-dance.html',
  styleUrl: './cosmic-dance.css',
})
export class CosmicDance implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  protected readonly earthAngle = signal(0.45);
  protected readonly moonAngle = signal(2.2);
  protected readonly playing = signal(true);
  protected readonly speed = signal(1);

  protected readonly sun = { x: 480, y: 300 };
  protected readonly orbitRx = 330;
  protected readonly orbitRy = 175;
  protected readonly moonRx = 72;
  protected readonly moonRy = 52;
  protected readonly speedOptions = [1, 2, 4];

  protected readonly motions = [
    { icon: '🔄', name: 'Rotación de la Tierra', value: '23 h 56 min', note: 'un giro sobre su eje' },
    { icon: '🌍', name: 'Traslación terrestre', value: '365,25 días', note: 'una vuelta al Sol' },
    { icon: '🌕', name: 'Revolución lunar', value: '27,3 días', note: 'una vuelta alrededor de la Tierra' },
    { icon: '📐', name: 'Inclinaciones', value: '23,5° / 5,1°', note: 'eje terrestre / órbita lunar' },
  ];

  private raf = 0;
  private last = 0;
  private reduced = false;

  protected readonly earthPoint = computed(() => ({
    x: this.sun.x + Math.cos(this.earthAngle()) * this.orbitRx,
    y: this.sun.y + Math.sin(this.earthAngle()) * this.orbitRy,
  }));

  protected readonly moonPoint = computed(() => {
    const earth = this.earthPoint();
    return {
      x: earth.x + Math.cos(this.moonAngle()) * this.moonRx,
      y: earth.y + Math.sin(this.moonAngle()) * this.moonRy,
    };
  });

  protected readonly alignment = computed<Alignment>(() => {
    const earth = this.earthPoint();
    const moon = this.moonPoint();
    const sunDir = Math.atan2(this.sun.y - earth.y, this.sun.x - earth.x);
    const moonDir = Math.atan2(moon.y - earth.y, moon.x - earth.x);
    let difference = moonDir - sunDir;
    difference = Math.atan2(Math.sin(difference), Math.cos(difference));
    if (Math.abs(difference) < 0.16) return 'solar';
    if (Math.abs(Math.abs(difference) - Math.PI) < 0.16) return 'lunar';
    return 'none';
  });

  protected readonly alignmentText = computed(() => {
    if (this.alignment() === 'solar') return 'Sol · Luna · Tierra alineados';
    if (this.alignment() === 'lunar') return 'Sol · Tierra · Luna alineados';
    return 'Explorando la órbita';
  });

  protected readonly orbitPath = computed(() => {
    const cx = this.sun.x;
    const cy = this.sun.y;
    return `M ${cx - this.orbitRx} ${cy} a ${this.orbitRx} ${this.orbitRy} 0 1 0 ${this.orbitRx * 2} 0 a ${this.orbitRx} ${this.orbitRy} 0 1 0 ${-this.orbitRx * 2} 0`;
  });

  ngAfterViewInit(): void {
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reduced) {
      this.playing.set(false);
      return;
    }

    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (this.playing()) this.start();
          } else {
            cancelAnimationFrame(this.raf);
          }
        },
        { rootMargin: '120px 0px' },
      );
      this.observer.observe(this.host.nativeElement);
    } else {
      this.start();
    }
  }

  protected togglePlay(): void {
    if (this.playing()) {
      this.stop();
    } else {
      this.start();
    }
  }

  protected setSpeed(value: number): void {
    this.speed.set(value);
  }

  protected alignSolar(): void {
    this.stop();
    this.earthAngle.set(Math.PI);
    this.moonAngle.set(0);
  }

  protected alignLunar(): void {
    this.stop();
    this.earthAngle.set(Math.PI);
    this.moonAngle.set(Math.PI);
  }

  protected releaseOrbit(): void {
    this.earthAngle.set(0.45);
    this.moonAngle.set(2.2);
    this.start();
  }

  private start(): void {
    this.playing.set(true);
    this.last = performance.now();
    cancelAnimationFrame(this.raf);
    const tick = (time: number) => {
      if (!this.playing()) return;
      const delta = Math.min(time - this.last, 44);
      this.last = time;
      const factor = delta * 0.00031 * this.speed();
      this.earthAngle.update((angle) => (angle + factor) % (Math.PI * 2));
      this.moonAngle.update((angle) => (angle + factor * 13.37) % (Math.PI * 2));
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private stop(): void {
    this.playing.set(false);
    cancelAnimationFrame(this.raf);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.observer?.disconnect();
  }
}
