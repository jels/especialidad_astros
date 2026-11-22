import { Component, OnDestroy, computed, signal } from '@angular/core';
import { RevealDirective } from '../directives/reveal';

type SkyMode = 'amanecer' | 'atardecer';

@Component({
  selector: 'app-morning-star',
  imports: [RevealDirective],
  templateUrl: './morning-star.html',
  styleUrl: './morning-star.css',
})
export class MorningStar implements OnDestroy {
  protected readonly mode = signal<SkyMode>('amanecer');
  protected readonly time = signal(22);
  protected readonly playing = signal(false);

  private raf = 0;
  private last = 0;

  protected readonly stars = Array.from({ length: 120 }, (_, i) => ({
    x: (Math.sin(i * 87.3 + 2.4) * 0.5 + 0.5) * 900,
    y: (Math.sin(i * 199.7 + 4.8) * 0.5 + 0.5) * 360,
    r: 0.4 + ((i * 7) % 10) / 13,
    opacity: 0.2 + ((i * 9) % 10) / 20,
  }));

  protected readonly altitude = computed(() =>
    this.mode() === 'amanecer' ? -18 + this.time() * 0.36 : 18 - this.time() * 0.36,
  );

  protected readonly daylight = computed(() => {
    const value = (this.altitude() - 1) / 13;
    return Math.max(0, Math.min(1, value));
  });

  protected readonly night = computed(() => {
    const value = (1 - this.altitude()) / 15;
    return Math.max(0.05, Math.min(1, value));
  });

  protected readonly twilight = computed(() => {
    const value = 1 - Math.abs(this.altitude()) / 17;
    return Math.max(0, Math.min(0.95, value));
  });

  protected readonly venusOpacity = computed(() =>
    Math.max(0.05, Math.min(1, 1 - this.daylight() * 1.28)),
  );

  protected readonly venusVisible = computed(() => this.daylight() < 0.55);

  protected readonly sunY = computed(
    () => 380 - Math.sin((this.altitude() * Math.PI) / 180) * 280,
  );

  protected readonly timeLabel = computed(() => {
    const base = this.mode() === 'amanecer' ? 5 * 60 : 18 * 60 + 30;
    const minutes = Math.round(base + this.time() * 1.2);
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  });

  protected readonly venusX = computed(() => (this.mode() === 'amanecer' ? 334 : 586));

  protected readonly modeLabel = computed(() =>
    this.mode() === 'amanecer' ? 'Lucero del alba' : 'Lucero de la tarde',
  );

  protected readonly statusCopy = computed(() => {
    if (this.venusVisible()) {
      return this.mode() === 'amanecer'
        ? 'Venus aparece antes que el Sol: por eso lo llamamos lucero del alba.'
        : 'Venus sigue brillando después de que se esconde el Sol: por eso lo llamamos lucero de la tarde.';
    }
    return 'El cielo está demasiado iluminado: Venus se pierde en el resplandor del Sol.';
  });

  protected setMode(mode: SkyMode): void {
    this.stop();
    this.mode.set(mode);
    this.time.set(mode === 'amanecer' ? 22 : 78);
  }

  protected onSlider(value: string): void {
    this.stop();
    this.time.set(Number(value));
  }

  protected togglePlay(): void {
    if (this.playing()) {
      this.stop();
      return;
    }
    this.playing.set(true);
    this.last = performance.now();
    const tick = (now: number) => {
      if (!this.playing()) return;
      const delta = Math.min(now - this.last, 50);
      this.last = now;
      this.time.update((t) => (t + delta * 0.016) % 100);
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
  }
}
