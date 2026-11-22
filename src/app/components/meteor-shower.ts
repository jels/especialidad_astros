import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { RevealDirective } from '../directives/reveal';

interface SkyStar {
  x: number;
  y: number;
  r: number;
  alpha: number;
  phase: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  hue: string;
}

interface Ripple {
  x: number;
  y: number;
  r: number;
  life: number;
  max: number;
}

@Component({
  selector: 'app-meteor-shower',
  imports: [RevealDirective],
  templateUrl: './meteor-shower.html',
  styleUrl: './meteor-shower.css',
})
export class MeteorShower implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  protected readonly wishes = signal(0);
  protected readonly wishMessage = signal('Toca el cielo y lanza tu primera estrella ✨');
  protected readonly burstCount = signal(0);

  private readonly messages = [
    'Que tu próximo examen salga mejor de lo que esperas.',
    'Un viaje a la Luna, aunque sea en sueños.',
    'Que siempre tengas tiempo para mirar el cielo.',
    'Aprobar el trabajo de Astronomía. Obvio.',
    'Que tu serie favorita no termine nunca.',
    'Un año con más risas que notificaciones.',
  ];

  private ctx?: CanvasRenderingContext2D;
  private stars: SkyStar[] = [];
  private meteors: Meteor[] = [];
  private ripples: Ripple[] = [];
  private raf = 0;
  private last = 0;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private spawnTimer = 0;
  private reduced = false;
  private observer?: IntersectionObserver;
  private readonly onResize = () => this.resize();

  ngAfterViewInit(): void {
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.ctx = this.canvasRef.nativeElement.getContext('2d') ?? undefined;
    this.resize();
    window.addEventListener('resize', this.onResize, { passive: true });

    if (this.reduced) {
      this.draw(0, 0);
      return;
    }

    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.startLoop();
          } else {
            cancelAnimationFrame(this.raf);
            this.last = 0;
          }
        },
        { rootMargin: '120px 0px' },
      );
      this.observer.observe(this.canvasRef.nativeElement);
    } else {
      this.startLoop();
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.observer?.disconnect();
    window.removeEventListener('resize', this.onResize);
  }

  private startLoop(): void {
    cancelAnimationFrame(this.raf);
    this.last = 0;
    this.raf = requestAnimationFrame(this.loop);
  }

  protected makeWish(event?: MouseEvent): void {
    const count = this.wishes() + 1;
    this.wishes.set(count);
    this.wishMessage.set(this.messages[Math.floor(Math.random() * this.messages.length)]);
    this.burstCount.set(count);

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event ? event.clientX - rect.left : rect.width * (0.3 + Math.random() * 0.5);
    const y = event ? event.clientY - rect.top : rect.height * 0.35;
    this.ripples.push({ x, y, r: 6, life: 0, max: 44 });
    this.burst(x, y, 4);
  }

  private loop = (time: number): void => {
    const delta = this.last ? Math.min(time - this.last, 50) : 16;
    this.last = time;
    this.spawnTimer += delta;

    if (this.spawnTimer > 1150 + Math.random() * 1100) {
      this.spawnTimer = 0;
      if (this.meteors.length < 9) this.spawnMeteor();
    }

    this.draw(time, delta);
    this.raf = requestAnimationFrame(this.loop);
  };

  private resize(): void {
    const canvas = this.canvasRef.nativeElement;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;
    canvas.width = Math.floor(this.width * this.dpr);
    canvas.height = Math.floor(this.height * this.dpr);
    this.ctx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.stars = Array.from({ length: Math.round(this.width / 5.5) }, () => ({
      x: Math.random(),
      y: Math.random() * 0.78,
      r: Math.random() * 1.3 + 0.3,
      alpha: Math.random() * 0.65 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));
    if (this.reduced) this.draw(0, 0);
  }

  private spawnMeteor(originX?: number, originY?: number): void {
    const fromRight = Math.random() > 0.5;
    const x = originX ?? this.width * (0.25 + Math.random() * 0.8);
    const y = originY ?? -10 - Math.random() * 40;
    this.meteors.push({
      x,
      y,
      vx: (fromRight ? -1 : 1) * (120 + Math.random() * 120),
      vy: 120 + Math.random() * 110,
      life: 0,
      max: 1200 + Math.random() * 500,
      size: 1.4 + Math.random() * 1.2,
      hue: Math.random() > 0.35 ? '255, 255, 255' : '165, 243, 252',
    });
  }

  private burst(x: number, y: number, amount: number): void {
    for (let i = 0; i < amount; i++) {
      this.meteors.push({
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 30,
        vx: -70 - Math.random() * 120,
        vy: 100 + Math.random() * 130,
        life: 0,
        max: 900 + Math.random() * 500,
        size: 1.3 + Math.random() * 1.4,
        hue: Math.random() > 0.5 ? '255, 255, 255' : '253, 230, 138',
      });
    }
  }

  private draw(time: number, delta: number): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const sky = ctx.createLinearGradient(0, 0, this.width * 0.35, this.height);
    sky.addColorStop(0, '#070a1c');
    sky.addColorStop(0.5, '#0b1026');
    sky.addColorStop(1, '#150f2b');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height);

    // Vía Láctea tenue, con bordes suaves
    ctx.save();
    ctx.translate(this.width / 2, this.height * 0.52);
    ctx.rotate(-0.36);
    ctx.scale(1, 0.24);
    const band = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width * 0.72);
    band.addColorStop(0, 'rgba(196,181,253,.16)');
    band.addColorStop(0.45, 'rgba(139,92,246,.10)');
    band.addColorStop(0.75, 'rgba(34,211,238,.045)');
    band.addColorStop(1, 'rgba(139,92,246,0)');
    ctx.fillStyle = band;
    ctx.beginPath();
    ctx.arc(0, 0, this.width * 0.72, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Estrellas
    ctx.globalCompositeOperation = 'lighter';
    for (const star of this.stars) {
      const twinkle = this.reduced ? 1 : 0.6 + 0.4 * Math.sin(time * 0.0012 + star.phase);
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${star.alpha * twinkle})`;
      ctx.arc(star.x * this.width, star.y * this.height, star.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Meteoros
    for (const meteor of this.meteors) {
      if (!this.reduced) {
        meteor.life += delta;
        meteor.x += (meteor.vx * delta) / 1000;
        meteor.y += (meteor.vy * delta) / 1000;
      }
      const fade = Math.max(0, 1 - meteor.life / meteor.max);
      if (fade <= 0) continue;
      const tail = 12 + 26 * fade;
      const grad = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - meteor.vx * 0.1, meteor.y - meteor.vy * 0.1);
      grad.addColorStop(0, `rgba(${meteor.hue},${0.95 * fade})`);
      grad.addColorStop(0.3, `rgba(${meteor.hue},${0.45 * fade})`);
      grad.addColorStop(1, `rgba(${meteor.hue},0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = meteor.size;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(meteor.x, meteor.y);
      ctx.lineTo(meteor.x - (meteor.vx / 160) * tail, meteor.y - (meteor.vy / 160) * tail);
      ctx.stroke();

      const glow = ctx.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, 7);
      glow.addColorStop(0, `rgba(255,255,255,${0.8 * fade})`);
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(meteor.x, meteor.y, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    this.meteors = this.meteors.filter(
      (m) => m.life < m.max && m.y < this.height + 80 && m.x > -100 && m.x < this.width + 100,
    );

    // Onda del deseo
    for (const ripple of this.ripples) {
      ripple.life += delta;
      ripple.r += delta * 0.12;
      const fade = Math.max(0, 1 - ripple.life / ripple.max);
      ctx.strokeStyle = `rgba(253,230,138,${fade * 0.6})`;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
      ctx.stroke();
    }
    this.ripples = this.ripples.filter((r) => r.life < r.max);

    ctx.globalCompositeOperation = 'source-over';

    // Silueta de montañas
    ctx.fillStyle = '#050711';
    ctx.beginPath();
    ctx.moveTo(0, this.height);
    ctx.lineTo(0, this.height - 34);
    ctx.lineTo(this.width * 0.16, this.height - 54);
    ctx.lineTo(this.width * 0.28, this.height - 36);
    ctx.lineTo(this.width * 0.42, this.height - 70);
    ctx.lineTo(this.width * 0.55, this.height - 40);
    ctx.lineTo(this.width * 0.68, this.height - 60);
    ctx.lineTo(this.width * 0.8, this.height - 38);
    ctx.lineTo(this.width, this.height - 58);
    ctx.lineTo(this.width, this.height);
    ctx.closePath();
    ctx.fill();
  }
}
