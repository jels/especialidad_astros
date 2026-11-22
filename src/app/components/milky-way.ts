import { Component, computed, signal } from '@angular/core';
import { RevealDirective } from '../directives/reveal';

@Component({
  selector: 'app-milky-way',
  imports: [RevealDirective],
  templateUrl: './milky-way.html',
  styleUrl: './milky-way.css',
})
export class MilkyWay {
  protected readonly view = signal<'cielo' | 'galaxia'>('cielo');
  protected readonly pollution = signal(12);
  protected readonly labels = signal(true);
  protected readonly checks = signal([false, false, false, false, false]);

  protected readonly checkItems = [
    {
      title: 'Aléjate de las luces',
      desc: 'Ve a un lugar sin faroles ni carteles. 30 minutos de auto ya cambian todo.',
      icon: '🌄',
    },
    {
      title: 'Elige noche sin Luna',
      desc: 'La Luna llena ilumina el cielo como un farol gigante. Busca Luna nueva o cuarto menguante.',
      icon: '🌑',
    },
    {
      title: 'Espera 20 minutos',
      desc: 'Tus ojos se adaptan a la oscuridad. No mires el celular: usa una linterna con papel rojo.',
      icon: '⏳',
    },
    {
      title: 'Mira hacia Sagitario',
      desc: 'Ahí está el centro galáctico. En el hemisferio sur, las noches de invierno son ideales.',
      icon: '🏹',
    },
    {
      title: 'Sin telescopio',
      desc: 'La Vía Láctea se ve mejor a simple vista. Solo necesitas cielo oscuro y paciencia.',
      icon: '👀',
    },
  ];

  protected readonly checkedCount = computed(() => this.checks().filter(Boolean).length);
  protected readonly allDone = computed(() => this.checkedCount() === this.checkItems.length);

  protected readonly milkyOpacity = computed(() => Math.max(0, 1 - this.pollution() / 82));
  protected readonly faintStarsOpacity = computed(() => Math.max(0.04, 1 - this.pollution() / 72));
  protected readonly brightStarsOpacity = computed(() => Math.max(0.3, 1 - this.pollution() / 180));
  protected readonly cityGlowOpacity = computed(() => Math.min(0.95, this.pollution() / 100));
  protected readonly visibility = computed(() => {
    if (this.pollution() <= 28) return { label: 'Alta', color: 'text-teal-300', bar: 'from-teal-300 to-cyan-300' };
    if (this.pollution() <= 62) return { label: 'Media', color: 'text-amber-300', bar: 'from-amber-300 to-orange-300' };
    return { label: 'Baja', color: 'text-rose-300', bar: 'from-rose-300 to-red-400' };
  });

  protected readonly visibilityCopy = computed(() => {
    if (this.pollution() <= 28)
      return 'Cielo oscuro: la Vía Láctea aparece como una franja lechosa con nubes oscuras de polvo.';
    if (this.pollution() <= 62)
      return 'Cielo suburbano: ves las estrellas más brillantes, pero la banda pierde contraste.';
    return 'Centro urbano: la contaminación lumínica borra casi todo el cielo profundo.';
  });

  protected readonly skyStars = Array.from({ length: 170 }, (_, i) => ({
    x: (Math.sin(i * 93.7 + 1.8) * 0.5 + 0.5) * 900,
    y: (Math.sin(i * 211.3 + 4.2) * 0.5 + 0.5) * 400,
    r: 0.4 + ((i * 7) % 10) / 12,
    opacity: 0.2 + ((i * 11) % 10) / 18,
    twinkle: i % 13 === 0,
  }));

  protected readonly brightStars = Array.from({ length: 26 }, (_, i) => ({
    x: (Math.sin(i * 143.1 + 3.2) * 0.5 + 0.5) * 900,
    y: (Math.sin(i * 77.7 + 2.5) * 0.5 + 0.5) * 380,
    r: 1.2 + ((i * 5) % 12) / 8,
  }));

  protected readonly bandStars = Array.from({ length: 90 }, (_, i) => ({
    x: (Math.sin(i * 61.7 + 2.1) * 0.5 + 0.5) * 920,
    y: (Math.sin(i * 173.9 + 1.1) * 0.5 + 0.5) * 150,
    r: 0.5 + ((i * 3) % 9) / 14,
    opacity: 0.2 + ((i * 13) % 10) / 20,
  }));

  protected readonly galaxyDots = Array.from({ length: 470 }, (_, i) => {
    const arm = i % 3;
    const t = ((i * 37) % 100) / 100;
    const radius = 34 + Math.pow(t, 0.78) * 218;
    const jitter = (((i * 53) % 100) / 100 - 0.5) * 0.42;
    const angle = arm * ((Math.PI * 2) / 3) + radius * 0.026 + jitter;
    const x = 450 + Math.cos(angle) * radius;
    const y = 280 + Math.sin(angle) * radius * 0.86;
    return {
      x,
      y,
      r: 0.5 + ((i * 17) % 12) / 9,
      opacity: 0.3 + ((i * 29) % 10) / 14,
      tint: i % 13 === 0 ? '#f9a8d4' : i % 9 === 0 ? '#a5f3fc' : '#e2e8f0',
    };
  });

  protected readonly galaxyClouds = Array.from({ length: 80 }, (_, i) => {
    const arm = i % 3;
    const t = ((i * 41) % 100) / 100;
    const radius = 36 + Math.pow(t, 0.8) * 215;
    const angle = arm * ((Math.PI * 2) / 3) + radius * 0.026 + (((i * 23) % 100) / 100 - 0.5) * 0.2;
    return {
      x: 450 + Math.cos(angle) * radius,
      y: 280 + Math.sin(angle) * radius * 0.86,
      r: 14 + ((i * 7) % 20),
      color: ['#8b5cf6', '#22d3ee', '#f0abfc'][arm],
    };
  });

  protected readonly galaxyArms = [0, 1, 2].map((arm) => {
    let d = '';
    for (let radius = 40; radius <= 252; radius += 8) {
      const angle = arm * ((Math.PI * 2) / 3) + radius * 0.026;
      const x = 450 + Math.cos(angle) * radius;
      const y = 280 + Math.sin(angle) * radius * 0.86;
      d += `${radius === 40 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    return { d, color: ['#8b5cf6', '#22d3ee', '#f0abfc'][arm] };
  });

  protected readonly sunPosition = (() => {
    const angle = 2.45;
    const radius = 148;
    return {
      x: 450 + Math.cos(angle) * radius,
      y: 280 + Math.sin(angle) * radius * 0.86,
    };
  })();

  protected setView(view: 'cielo' | 'galaxia'): void {
    this.view.set(view);
  }

  protected toggleCheck(index: number): void {
    this.checks.update((checks) => checks.map((value, i) => (i === index ? !value : value)));
  }

  protected toggleLabels(): void {
    this.labels.set(!this.labels());
  }

  protected resetChecks(): void {
    this.checks.set([false, false, false, false, false]);
  }
}
