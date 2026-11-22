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
import { Planet, PLANETS } from '../data/planets';

@Component({
  selector: 'app-solar-system',
  imports: [RevealDirective],
  templateUrl: './solar-system.html',
  styleUrl: './solar-system.css',
})
export class SolarSystem implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  protected readonly planets = PLANETS;
  protected readonly playing = signal(true);
  protected readonly selectedId = signal('tierra');
  protected readonly selectedPlanet = computed(
    () => this.planets.find((p) => p.id === this.selectedId()) ?? this.planets[2],
  );
  protected readonly selectedIndex = computed(() =>
    this.planets.findIndex((p) => p.id === this.selectedId()),
  );

  private readonly angles = signal<number[]>(this.planets.map((p) => p.startAngle));
  private readonly speeds = this.planets.map(
    (p) => 0.27 / Math.pow(p.orbitRx / 100, 0.55),
  );

  private raf = 0;
  private last = 0;
  private reduced = false;

  protected readonly sun = { x: 500, y: 325 };
  private readonly perspective = 0.38;

  protected readonly bodies = computed(() =>
    this.planets.map((planet, index) => {
      const angle = this.angles()[index];
      return {
        ...planet,
        angle,
        x: this.sun.x + Math.cos(angle) * planet.orbitRx,
        y: this.sun.y + Math.sin(angle) * planet.orbitRx * this.perspective,
      };
    }),
  );

  protected readonly selectedBody = computed(
    () => this.bodies().find((b) => b.id === this.selectedId()) ?? this.bodies()[2],
  );

  protected readonly belt = Array.from({ length: 52 }, (_, i) => {
    const angle = i * 2.399;
    const orbit = 216 + (i % 7) * 5;
    return {
      x: 500 + Math.cos(angle) * orbit,
      y: 325 + Math.sin(angle) * orbit * this.perspective,
      r: 0.8 + (i % 3) * 0.35,
    };
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
      this.playing.set(false);
      cancelAnimationFrame(this.raf);
    } else {
      this.start();
    }
  }

  protected selectPlanet(id: string): void {
    this.selectedId.set(id);
  }

  protected moveSelection(step: number): void {
    const index = (this.selectedIndex() + step + this.planets.length) % this.planets.length;
    this.selectedId.set(this.planets[index].id);
  }

  protected orbitPath(planet: Planet): string {
    const rx = planet.orbitRx;
    const ry = planet.orbitRx * this.perspective;
    return `M ${this.sun.x - rx} ${this.sun.y} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`;
  }

  private start(): void {
    this.playing.set(true);
    this.last = performance.now();
    cancelAnimationFrame(this.raf);
    const tick = (time: number) => {
      if (!this.playing()) return;
      const delta = Math.min(time - this.last, 44);
      this.last = time;
      this.angles.update((angles) =>
        angles.map((angle, index) => (angle + delta * 0.001 * this.speeds[index]) % (Math.PI * 2)),
      );
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.observer?.disconnect();
  }
}
