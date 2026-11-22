import { Component, computed, signal } from '@angular/core';
import { RevealDirective } from '../directives/reveal';

interface Question {
  topic: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

@Component({
  selector: 'app-space-quiz',
  imports: [RevealDirective],
  templateUrl: './space-quiz.html',
  styleUrl: './space-quiz.css',
})
export class SpaceQuiz {
  protected readonly questions: Question[] = [
    {
      topic: 'Eclipses',
      question: '¿Qué causa un eclipse solar?',
      options: [
        'La Luna se interpone entre el Sol y la Tierra.',
        'La Tierra se interpone entre el Sol y la Luna.',
        'El Sol deja de emitir luz durante unos minutos.',
        'Venus pasa delante del Sol y lo tapa.',
      ],
      answer: 0,
      explanation:
        'La Luna tapa el Sol y proyecta su sombra sobre la Tierra. Ocurre en Luna nueva, cuando los tres cuerpos se alinean cerca de un nodo de la órbita lunar.',
    },
    {
      topic: 'Meteoros',
      question: '¿Qué es realmente una estrella fugaz?',
      options: [
        'Una estrella que se desprende y cae del cielo.',
        'Un meteoro: polvo o roca que brilla al entrar en la atmósfera.',
        'Un planeta que se mueve muy rápido entre las estrellas.',
        'Un trozo de la Luna que se desprende.',
      ],
      answer: 1,
      explanation:
        'Es un meteoro: un fragmento de roca o polvo espacial que se calienta por la fricción con la atmósfera y produce una estela luminosa. Si sobrevive y llega al suelo, se llama meteorito.',
    },
    {
      topic: 'Velocidad de la luz',
      question: '¿Cuál es la velocidad de la luz en el vacío?',
      options: [
        '300.000 kilómetros por hora.',
        '1.080 kilómetros por segundo.',
        'Casi 300.000 kilómetros por segundo.',
        'La misma velocidad que el sonido.',
      ],
      answer: 2,
      explanation:
        'Exactamente 299.792.458 metros por segundo: casi 300.000 km/s. En un segundo podría dar 7,5 vueltas a la Tierra.',
    },
    {
      topic: 'La Luna',
      question: '¿Cuál es el cuerpo celeste más cercano a la Tierra?',
      options: ['El Sol', 'La Luna', 'Venus', 'Marte'],
      answer: 1,
      explanation:
        'La Luna es nuestro satélite natural y nuestro vecino más cercano. La luz tarda solo 1,3 segundos en llegar desde allí.',
    },
    {
      topic: 'La Luna',
      question: '¿A qué distancia media está la Luna de la Tierra?',
      options: ['38.400 km', '384.400 km', '1.000.000 km', '149,6 millones km'],
      answer: 1,
      explanation:
        'La distancia media es de 384.400 km. Varía entre unos 363.300 km en el perigeo y 405.500 km en el apogeo. Entre la Tierra y la Luna caben unas 30 Tierras.',
    },
    {
      topic: 'Mareas',
      question: 'Las mareas más intensas (mareas vivas) ocurren cuando…',
      options: [
        'La Luna está en cuarto creciente.',
        'El Sol y la Luna están alineados, en Luna nueva o llena.',
        'La Luna está en el punto más lejano de su órbita.',
        'Sopla más viento sobre el océano.',
      ],
      answer: 1,
      explanation:
        'En Luna nueva y en Luna llena, el Sol y la Luna tiran en la misma dirección. Sus efectos se suman y producen mareas vivas. En los cuartos se compensan y forman mareas muertas.',
    },
    {
      topic: 'Eclipses',
      question: '¿En qué orden se alinean los cuerpos durante un eclipse lunar?',
      options: [
        'Sol → Luna → Tierra',
        'Luna → Sol → Tierra',
        'Sol → Tierra → Luna',
        'Tierra → Luna → Sol',
      ],
      answer: 2,
      explanation:
        'La Tierra queda en el medio y su sombra cubre la Luna. Como la atmósfera terrestre desvía la luz roja, la Luna puede verse cobriza: la famosa “Luna de sangre”.',
    },
    {
      topic: 'Estrellas',
      question: '¿Cuál es la diferencia principal entre un planeta y una estrella fija?',
      options: [
        'El planeta refleja la luz y orbita una estrella; la estrella produce su propia luz.',
        'Las estrellas están totalmente inmóviles y los planetas no.',
        'Los planetas siempre son más grandes que las estrellas.',
        'No hay ninguna diferencia: son lo mismo.',
      ],
      answer: 0,
      explanation:
        'Una estrella genera energía por fusión nuclear y emite luz propia. Un planeta no: brilla porque refleja la luz de una estrella. “Fija” es un término histórico: también se mueven, pero parecen quietas entre las constelaciones.',
    },
    {
      topic: 'Constelaciones',
      question: 'Desde latitudes medias del hemisferio sur, ¿qué constelaciones se ven todo el año?',
      options: [
        'Orión y Escorpio',
        'La Cruz del Sur y Centauro',
        'La Osa Mayor y Casiopea',
        'Sagitario y la Cruz del Sur',
      ],
      answer: 1,
      explanation:
        'La Cruz del Sur y Centauro son circumpolares en gran parte del hemisferio sur: giran alrededor del polo sur celeste y nunca se ocultan. En el hemisferio norte, las circumpolares clásicas son la Osa Mayor y Casiopea.',
    },
    {
      topic: 'Vía Láctea',
      question: '¿Qué es la Vía Láctea?',
      options: [
        'Una nube de leche cósmica formada por gas.',
        'Una constelación que solo se ve en verano.',
        'Nuestra galaxia, vista desde dentro.',
        'El conjunto de todos los planetas del sistema solar.',
      ],
      answer: 2,
      explanation:
        'Es la galaxia en la que vivimos: una espiral barrada con cientos de miles de millones de estrellas, gas y polvo. La vemos como una franja porque estamos dentro de su disco.',
    },
    {
      topic: 'Venus',
      question: '¿Cuál es la estrella matutina o vespertina?',
      options: ['Sirio', 'La Luna', 'Marte', 'Venus'],
      answer: 3,
      explanation:
        'Venus es el “lucero”: se ve poco antes del amanecer o poco después del atardecer. No es una estrella, sino un planeta que refleja la luz del Sol y brilla muchísimo.',
    },
    {
      topic: 'Cenit y nadir',
      question: '¿Qué es el nadir?',
      options: [
        'El punto más alto del cielo.',
        'La estrella más brillante de la noche.',
        'El punto directamente opuesto al cenit, bajo tus pies.',
        'La línea que separa el cielo del suelo.',
      ],
      answer: 2,
      explanation:
        'El nadir es la dirección opuesta al cenit: atraviesa el centro de la Tierra y sale por el otro lado. El cenit está a 90° sobre ti; el nadir, a −90°.',
    },
    {
      topic: 'Sistema solar',
      question: '¿Cuál es el orden correcto de los planetas desde el Sol?',
      options: [
        'Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano, Neptuno.',
        'Mercurio, Tierra, Venus, Marte, Saturno, Júpiter, Neptuno, Urano.',
        'Venus, Mercurio, Tierra, Júpiter, Marte, Saturno, Urano, Neptuno.',
        'Tierra, Mercurio, Venus, Marte, Júpiter, Saturno, Neptuno, Urano.',
      ],
      answer: 0,
      explanation:
        'Los planetas, en orden desde el Sol, son: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno. Los cuatro primeros son rocosos; los cuatro últimos, gigantes.',
    },
  ];

  protected readonly index = signal(0);
  protected readonly chosen = signal<number | null>(null);
  protected readonly score = signal(0);
  protected readonly finished = signal(false);

  protected readonly total = this.questions.length;
  protected readonly current = computed(() => this.questions[this.index()]);
  protected readonly answered = computed(() => this.chosen() !== null);
  protected readonly isCorrect = computed(() => this.chosen() === this.current().answer);
  protected readonly progress = computed(() =>
    this.finished()
      ? 100
      : ((this.index() + (this.answered() ? 1 : 0)) / this.total) * 100,
  );
  protected readonly percentage = computed(() => Math.round((this.score() / this.total) * 100));

  protected readonly rank = computed(() => {
    const percent = this.percentage();
    if (percent === 100) return { title: 'Maestro galáctico', icon: '🌌', copy: 'Perfecto. El universo no tiene secretos para ti.' };
    if (percent >= 75) return { title: 'Explorador estelar', icon: '🚀', copy: 'Muy bien. Tienes el cielo bastante mapeado.' };
    if (percent >= 50) return { title: 'Cadete cósmico', icon: '🛰️', copy: 'Buen comienzo. Repasa algunas misiones y vuelve a intentarlo.' };
    return { title: 'Curioso en órbita', icon: '🔭', copy: 'Todo gran astrónomo empezó mirando arriba. Repasa y prueba de nuevo.' };
  });

  protected choose(option: number): void {
    if (this.answered()) return;
    this.chosen.set(option);
    if (option === this.current().answer) {
      this.score.update((score) => score + 1);
    }
  }

  protected next(): void {
    if (!this.answered()) return;
    if (this.index() < this.total - 1) {
      this.index.update((index) => index + 1);
      this.chosen.set(null);
    } else {
      this.finished.set(true);
    }
  }

  protected restart(): void {
    this.index.set(0);
    this.chosen.set(null);
    this.score.set(0);
    this.finished.set(false);
  }

  protected optionClass(option: number): string {
    const answered = this.answered();
    const chosen = this.chosen();
    const correct = this.current().answer;
    if (!answered) {
      return 'border-white/10 bg-white/[0.025] text-slate-300 hover:border-cyan-300/40 hover:bg-cyan-300/[0.06] hover:text-white';
    }
    if (option === correct) {
      return 'border-emerald-300/50 bg-emerald-300/[0.12] text-emerald-50';
    }
    if (option === chosen) {
      return 'border-rose-300/50 bg-rose-300/[0.1] text-rose-100';
    }
    return 'border-white/5 bg-white/[0.015] text-slate-600';
  }
}
