import { Component, OnDestroy, computed, signal } from '@angular/core';
import { RevealDirective } from '../directives/reveal';

type Scenario = 'solar' | 'lunar';

@Component({
  selector: 'app-eclipse-lab',
  imports: [RevealDirective],
  templateUrl: './eclipse-lab.html',
  styleUrl: './eclipse-lab.css',
})
export class EclipseLab implements OnDestroy {
  protected readonly scenario = signal<Scenario>('solar');
  protected readonly position = signal(50);
  protected readonly playing = signal(false);
  protected readonly tiltOpen = signal(false);

  private raf = 0;
  private last = 0;

  protected readonly earth = { x: 690, y: 290 };
  protected readonly moon = computed(() => {
    const angle = (this.position() / 100) * Math.PI * 2;
    return {
      x: Math.round(690 + Math.cos(angle) * 205),
      y: Math.round(290 + Math.sin(angle) * 130),
    };
  });

  protected readonly state = computed<'solar' | 'lunar' | 'none'>(() => {
    const p = this.position();
    if (Math.abs(p - 50) <= 7) return 'solar';
    if (p <= 7 || p >= 93) return 'lunar';
    return 'none';
  });

  protected readonly matchesScenario = computed(
    () => this.state() === this.scenario(),
  );

  protected readonly solarCone = computed(() => {
    const m = this.moon();
    return `${m.x},${m.y - 15} ${m.x},${m.y + 15} 662,312 662,268`;
  });

  protected readonly moonTransform = computed(
    () => `translate(${this.moon().x} ${this.moon().y})`,
  );

  protected readonly angleLabel = computed(() => Math.round(this.position() * 3.6));

  protected readonly content = computed(() =>
    this.scenario() === 'solar'
      ? {
          label: 'Eclipse solar',
          icon: '🌑',
          accent: 'text-cyan-300',
          title: 'La Luna tapa al Sol',
          text: 'La Luna se coloca justo entre el Sol y la Tierra. Su sombra viaja por el espacio y toca nuestro planeta: en la franja de sombra, el día se vuelve noche por unos minutos.',
          steps: [
            'Fase: Luna nueva.',
            'Orden exacto: Sol → Luna → Tierra.',
            'La sombra de la Luna cae sobre la Tierra.',
          ],
          fact: 'La totalidad dura como máximo 7 minutos y 30 segundos en un mismo lugar. Los eclipses anulares ocurren cuando la Luna está más lejos y deja un “anillo de fuego”.',
          types: ['Total', 'Parcial', 'Anular'],
        }
      : {
          label: 'Eclipse lunar',
          icon: '🌕',
          accent: 'text-rose-300',
          title: 'La Tierra tapa a la Luna',
          text: 'La Tierra se coloca entre el Sol y la Luna. La Luna entra en el cono de sombra terrestre y deja de recibir luz directa del Sol, aunque no desaparece: se tiñe de rojo.',
          steps: [
            'Fase: Luna llena.',
            'Orden exacto: Sol → Tierra → Luna.',
            'La Luna atraviesa la sombra de la Tierra.',
          ],
          fact: 'La atmósfera terrestre desvía la luz roja hacia la sombra y filtra el azul. Por eso hablamos de “Luna de sangre”. Un eclipse lunar puede verse desde medio planeta a la vez.',
          types: ['Total', 'Parcial', 'Penumbral'],
        },
  );

  protected setScenario(scenario: Scenario): void {
    this.scenario.set(scenario);
    this.stopOrbit();
    this.position.set(scenario === 'solar' ? 50 : 0);
  }

  protected onSlider(value: string): void {
    this.stopOrbit();
    this.position.set(Number(value));
  }

  protected toggleOrbit(): void {
    if (this.playing()) {
      this.stopOrbit();
      return;
    }
    this.playing.set(true);
    this.last = performance.now();
    const tick = (time: number) => {
      if (!this.playing()) return;
      const delta = Math.min(time - this.last, 50);
      this.last = time;
      this.position.update((p) => (p + delta * 0.008) % 100);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private stopOrbit(): void {
    this.playing.set(false);
    cancelAnimationFrame(this.raf);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
  }
}
