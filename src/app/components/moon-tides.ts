import { AfterViewInit, Component, OnDestroy, computed, input, signal } from '@angular/core';
import { RevealDirective } from '../directives/reveal';

@Component({
  selector: 'app-moon-tides',
  imports: [RevealDirective],
  templateUrl: './moon-tides.html',
  styleUrl: './moon-tides.css',
  host: { '[class.moon-presentation]': 'presentation()' },
})
export class MoonTides implements AfterViewInit, OnDestroy {
  readonly presentation = input(false);

  protected readonly phase = signal(0);
  protected readonly playing = signal(false);
  protected readonly scaleOpen = signal(false);
  protected readonly earths = Array.from({ length: 30 }, (_, i) => i);

  private raf = 0;
  private last = 0;

  protected readonly tideFactor = computed(() =>
    Math.abs(Math.cos((this.phase() * Math.PI) / 180)),
  );

  protected readonly moonAngle = computed(() => this.phase() + 180);

  protected readonly moonPoint = computed(() => {
    const angle = (this.moonAngle() * Math.PI) / 180;
    return {
      x: 500 + Math.cos(angle) * 250,
      y: 260 + Math.sin(angle) * 150,
    };
  });

  protected readonly ocean = computed(() => {
    const factor = this.tideFactor();
    return { rx: 92 + 22 * factor, ry: 70 };
  });

  protected readonly phaseName = computed(() => {
    const p = ((this.phase() % 360) + 360) % 360;
    const phases = [
      'Luna nueva',
      'Luna creciente',
      'Cuarto creciente',
      'Gibosa creciente',
      'Luna llena',
      'Gibosa menguante',
      'Cuarto menguante',
      'Luna menguante',
    ];
    const index = Math.round(p / 45) % 8;
    return phases[index];
  });

  protected readonly tideLabel = computed(() => {
    const f = this.tideFactor();
    if (f > 0.72) return 'Mareas vivas';
    if (f < 0.3) return 'Mareas muertas';
    return 'Mareas intermedias';
  });

  protected readonly tideCopy = computed(() => {
    const f = this.tideFactor();
    if (f > 0.72)
      return 'El Sol y la Luna tiran en la misma dirección: sus efectos se suman. Ocurre en Luna nueva y Luna llena.';
    if (f < 0.3)
      return 'El Sol y la Luna forman un ángulo recto: sus tirones se compensan en parte. Ocurre en los cuartos.';
    return 'La Luna se mueve entre una alineación y una posición perpendicular. La marea está en un punto intermedio.';
  });

  protected setPhase(value: number): void {
    this.stop();
    this.phase.set(value);
  }

  protected onSlider(value: string): void {
    this.stop();
    this.phase.set(Number(value));
  }

  protected togglePlay(): void {
    if (this.playing()) {
      this.stop();
      return;
    }
    this.start();
  }

  private start(): void {
    if (this.playing()) return;
    this.playing.set(true);
    this.last = performance.now();
    const tick = (time: number) => {
      if (!this.playing()) return;
      const delta = Math.min(time - this.last, 50);
      this.last = time;
      this.phase.update((p) => (p + delta * 0.012) % 360);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private stop(): void {
    this.playing.set(false);
    cancelAnimationFrame(this.raf);
  }

  ngAfterViewInit(): void {
    if (this.presentation() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.start();
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
  }
}
