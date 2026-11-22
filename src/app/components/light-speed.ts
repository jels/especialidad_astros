import { Component, OnDestroy, computed, signal } from '@angular/core';
import { RevealDirective } from '../directives/reveal';

interface Destination {
  name: string;
  article: string;
  emoji: string;
  distance: number;
  note: string;
}

interface Racer {
  name: string;
  icon: string;
  speed: number;
  time: string;
  bar: number;
  gradient: string;
}

@Component({
  selector: 'app-light-speed',
  imports: [RevealDirective],
  templateUrl: './light-speed.html',
  styleUrl: './light-speed.css',
})
export class LightSpeed implements OnDestroy {
  protected readonly destinations: Destination[] = [
    {
      name: 'la Luna',
      article: 'la',
      emoji: '🌕',
      distance: 384_400,
      note: 'Distancia media Tierra–Luna',
    },
    {
      name: 'el Sol',
      article: 'el',
      emoji: '☀️',
      distance: 149_600_000,
      note: 'Distancia media Tierra–Sol',
    },
    {
      name: 'Marte',
      article: 'Marte',
      emoji: '🔴',
      distance: 225_000_000,
      note: 'Distancia media Tierra–Marte',
    },
  ];

  protected readonly selected = signal(0);
  protected readonly unitOpen = signal(false);
  protected readonly rayRunning = signal(false);

  private rayTimeout?: number;

  protected readonly destination = computed(() => this.destinations[this.selected()]);

  protected readonly lightTime = computed(() =>
    this.formatTime(this.destination().distance / 299_792),
  );

  protected readonly lightSeconds = computed(() => this.destination().distance / 299_792);

  protected readonly racers = computed<Racer[]>(() => {
    const distance = this.destination().distance;
    const base = [
      { name: 'Luz', icon: '⚡', speed: 299_792, gradient: 'from-cyan-300 to-violet-400' },
      { name: 'Sonido', icon: '🔊', speed: 0.343, gradient: 'from-emerald-300 to-teal-400' },
      { name: 'Avión', icon: '✈️', speed: 0.25, gradient: 'from-sky-300 to-blue-400' },
      { name: 'Usain Bolt', icon: '🏃', speed: 0.01044, gradient: 'from-amber-300 to-orange-400' },
    ];
    return base.map((racer) => ({
      ...racer,
      time: this.formatTime(distance / racer.speed),
      bar: this.barWidth(racer.speed),
    }));
  });

  protected selectDestination(index: number): void {
    this.selected.set(index);
  }

  protected toggleUnit(): void {
    this.unitOpen.set(!this.unitOpen());
  }

  protected sendRay(): void {
    if (this.rayRunning()) return;
    this.rayRunning.set(true);
    this.rayTimeout = window.setTimeout(() => this.rayRunning.set(false), 2300);
  }

  protected formatNumber(value: number): string {
    return new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value);
  }

  protected formatTime(seconds: number): string {
    if (seconds < 60) {
      const value = seconds < 10 ? seconds.toFixed(2) : seconds.toFixed(1);
      return `${value.replace('.', ',')} s`;
    }
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const rest = Math.round(seconds % 60);
      return `${minutes} min ${rest} s`;
    }
    const hours = seconds / 3600;
    if (hours < 48) {
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      return `${h} h ${m} min`;
    }
    const days = seconds / 86_400;
    if (days < 365) {
      return `${new Intl.NumberFormat('es-AR', { maximumFractionDigits: days < 10 ? 1 : 0 }).format(days)} días`;
    }
    const years = days / 365.25;
    return `${new Intl.NumberFormat('es-AR', { maximumFractionDigits: years < 10 ? 1 : 0 }).format(years)} años`;
  }

  private barWidth(speed: number): number {
    const min = -2.5;
    const max = Math.log10(299_792);
    return Math.max(7, Math.round(((Math.log10(speed) - min) / (max - min)) * 100));
  }

  ngOnDestroy(): void {
    if (this.rayTimeout) window.clearTimeout(this.rayTimeout);
  }
}
