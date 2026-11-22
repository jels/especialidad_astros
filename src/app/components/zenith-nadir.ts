import { Component, computed, signal } from '@angular/core';
import { RevealDirective } from '../directives/reveal';

@Component({
  selector: 'app-zenith-nadir',
  imports: [RevealDirective],
  templateUrl: './zenith-nadir.html',
  styleUrl: './zenith-nadir.css',
})
export class ZenithNadir {
  protected readonly altitude = signal(58);

  protected readonly marker = computed(() => ({
    x: 350,
    y: 330 - Math.sin((this.altitude() * Math.PI) / 180) * 280,
  }));

  protected readonly aboveHorizon = computed(() => this.altitude() > 0);

  protected readonly pointName = computed(() => {
    if (this.altitude() === 90) return 'Cenit';
    if (this.altitude() === -90) return 'Nadir';
    if (this.altitude() === 0) return 'Horizonte';
    return this.altitude() > 0 ? 'Sobre el horizonte' : 'Bajo el horizonte';
  });

  protected readonly explanation = computed(() => {
    const altitude = this.altitude();
    if (altitude === 90) return 'Estás apuntando exactamente al cenit: el punto imaginario justo sobre tu cabeza.';
    if (altitude === -90) return 'Estás apuntando al nadir: el punto opuesto al cenit, al otro lado del centro de la Tierra.';
    if (altitude === 0) return 'El horizonte: la frontera entre el cielo visible y el suelo. Está a 0° de altura.';
    if (altitude > 0) return `El marcador está ${altitude}° sobre el horizonte. Cuanto más alto, más cerca del cenit.`;
    return `El marcador está ${Math.abs(altitude)}° bajo el horizonte: del otro lado de la Tierra, invisible para ti.`;
  });

  protected readonly stars = Array.from({ length: 44 }, (_, i) => ({
    x: 110 + ((Math.sin(i * 131.7 + 2.1) * 0.5 + 0.5) * 480),
    y: 70 + ((Math.sin(i * 89.3 + 1.4) * 0.5 + 0.5) * 240),
    r: 0.5 + ((i * 5) % 9) / 14,
    opacity: 0.2 + ((i * 7) % 10) / 22,
  }));

  protected setAltitude(value: number): void {
    this.altitude.set(value);
  }

  protected onSlider(value: string): void {
    this.altitude.set(Number(value));
  }
}
