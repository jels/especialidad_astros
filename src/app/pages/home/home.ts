import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../directives/reveal';
import { FINAL_MISSION, MISSIONS } from '../../data/missions';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RevealDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly missions = MISSIONS;
  protected readonly finalMission = FINAL_MISSION;

  protected readonly steps = [
    {
      num: '01',
      title: 'Elige una misión',
      desc: 'Cada punto del trabajo tiene su propia página para explorar sin distracciones.',
      icon: '🧭',
    },
    {
      num: '02',
      title: 'Toca y experimenta',
      desc: 'Simuladores, mapas estelares y diagramas que responden a tus movimientos.',
      icon: '🪐',
    },
    {
      num: '03',
      title: 'Cierra con el test',
      desc: 'Trece preguntas para comprobar cuánto aprendiste. Sin notas y sin presión.',
      icon: '🧠',
    },
  ];

  protected readonly tickerFacts = [
    '⚡ La luz viaja a 299.792 km/s',
    '🌕 La Luna está a 384.400 km de distancia',
    '☀️ La luz del Sol tarda 8 min 20 s en llegar',
    '🪐 El Sol concentra el 99,86 % de la masa del sistema solar',
    '🌌 La Vía Láctea tiene más de 100.000 años luz de diámetro',
    '✨ Las estrellas nacen, viven y mueren',
    '🪐 Un día en Venus dura más que un año venusino',
    '🌍 La Luna se aleja 3,8 cm cada año',
  ];

  protected readonly marqueeFacts = [...this.tickerFacts, ...this.tickerFacts];
}
