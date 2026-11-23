import { Component, computed, input, signal } from '@angular/core';
import { RevealDirective } from '../directives/reveal';

interface FixedStar {
  id: string;
  name: string;
  constellation: string;
  x: number;
  y: number;
  magnitude: number;
  distance: string;
  color: string;
  glow: string;
  howTo: string;
  fact: string;
}

@Component({
  selector: 'app-fixed-stars',
  imports: [RevealDirective],
  templateUrl: './fixed-stars.html',
  styleUrl: './fixed-stars.css',
  host: { '[class.stars-presentation]': 'presentation()' },
})
export class FixedStars {
  readonly presentation = input(false);

  protected readonly selectedId = signal('sirio');
  protected readonly showNames = signal(true);

  protected readonly stars: FixedStar[] = [
    {
      id: 'sirio',
      name: 'Sirio',
      constellation: 'Can Mayor',
      x: 486,
      y: 258,
      magnitude: -1.46,
      distance: '8,6 años luz',
      color: '#e0f2fe',
      glow: 'rgba(147,197,253,.9)',
      howTo:
        'Sigue las tres estrellas del cinturón de Orión hacia abajo y a la izquierda. En el hemisferio sur brilla alto en las noches de verano.',
      fact: 'Es la estrella más brillante del cielo nocturno. No es la más luminosa de todas, sino una de las más cercanas y jóvenes.',
    },
    {
      id: 'canopo',
      name: 'Canopo',
      constellation: 'Carina',
      x: 642,
      y: 420,
      magnitude: -0.74,
      distance: '310 años luz',
      color: '#fef9c3',
      glow: 'rgba(253,230,138,.8)',
      howTo:
        'En el cielo austral aparece bastante baja, al sur. Si ves a Sirio, Canopo suele estar más abajo y a la derecha.',
      fact: 'Es la segunda estrella más brillante vista desde la Tierra y fue usada durante siglos como referencia para la navegación.',
    },
    {
      id: 'alfa',
      name: 'Alfa Centauri',
      constellation: 'Centauro',
      x: 262,
      y: 332,
      magnitude: -0.27,
      distance: '4,37 años luz',
      color: '#fef3c7',
      glow: 'rgba(254,243,199,.85)',
      howTo:
        'Está muy cerca de la Cruz del Sur. A simple vista parece una sola estrella brillante, apenas a la izquierda de la cruz.',
      fact: 'Es el sistema estelar más cercano al Sol. En realidad son tres estrellas: Alfa Centauri A, B y Próxima Centauri.',
    },
    {
      id: 'achernar',
      name: 'Achernar',
      constellation: 'Eridano',
      x: 772,
      y: 380,
      magnitude: 0.46,
      distance: '139 años luz',
      color: '#dbeafe',
      glow: 'rgba(191,219,254,.8)',
      howTo:
        'Cierra el largo “río” de Eridano. En el hemisferio sur es fácil de ver en las noches de primavera, alta hacia el sur.',
      fact: 'Gira tan rápido que su ecuador se “abomba”: no es una esfera perfecta, sino una de las estrellas más achatadas conocidas.',
    },
    {
      id: 'acrux',
      name: 'Acrux',
      constellation: 'Cruz del Sur',
      x: 350,
      y: 236,
      magnitude: 0.77,
      distance: '321 años luz',
      color: '#e0f2fe',
      glow: 'rgba(165,243,252,.8)',
      howTo:
        'Es la estrella que está en la punta inferior de la Cruz del Sur. La cruz sirve como brújula: su eje largo apunta hacia el polo sur celeste.',
      fact: 'Acrux también es un sistema múltiple: lo que vemos como una estrella son al menos dos estrellas muy calientes que orbitan juntas.',
    },
  ];

  protected readonly selected = computed(
    () => this.stars.find((star) => star.id === this.selectedId()) ?? this.stars[0],
  );

  protected readonly brightness = computed(() => {
    const magnitude = this.selected().magnitude;
    return Math.max(16, Math.min(100, Math.round(((1.4 - magnitude) / 3) * 100)));
  });

  protected readonly fieldStars = Array.from({ length: 95 }, (_, i) => {
    const x = (Math.sin(i * 127.1 + 3.7) * 0.5 + 0.5) * 900;
    const y = (Math.sin(i * 311.7 + 1.3) * 0.5 + 0.5) * 540;
    return {
      x,
      y,
      r: 0.5 + ((i * 7) % 10) / 12,
      opacity: 0.2 + ((i * 13) % 10) / 16,
    };
  });

  protected toggleNames(): void {
    this.showNames.set(!this.showNames());
  }

  protected selectStar(id: string): void {
    this.selectedId.set(id);
  }
}
