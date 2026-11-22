import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  phase: number;
  speed: number;
  hue: 'white' | 'cyan' | 'violet';
}

interface Streak {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
}

@Component({
  selector: 'app-starfield',
  template: `
    <canvas #canvas class="pointer-events-none fixed inset-0 z-0 h-full w-full"></canvas>
    <div
      class="pointer-events-none fixed -top-40 -left-32 z-0 h-[34rem] w-[34rem] rounded-full bg-violet-700/15 blur-[110px]"
    ></div>
    <div
      class="pointer-events-none fixed top-1/3 -right-40 z-0 h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-[120px]"
    ></div>
    <div
      class="pointer-events-none fixed -bottom-48 left-1/3 z-0 h-[28rem] w-[38rem] rounded-full bg-fuchsia-700/10 blur-[130px]"
    ></div>
    <div
      class="noise pointer-events-none fixed inset-0 z-0 opacity-[0.025] mix-blend-soft-light"
    ></div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class Starfield implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx?: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private streaks: Streak[] = [];
  private frame = 0;
  private raf = 0;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private reduced = false;
  private readonly onResize = () => this.resize();

  ngAfterViewInit(): void {
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.ctx = this.canvasRef.nativeElement.getContext('2d') ?? undefined;
    this.resize();
    window.addEventListener('resize', this.onResize, { passive: true });

    if (this.reduced) {
      this.draw(0);
    } else {
      this.raf = requestAnimationFrame(this.loop);
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
  }

  private loop = (time: number): void => {
    this.frame = time;
    if (Math.random() < 0.0035 && this.streaks.length < 2) {
      this.spawnStreak();
    }
    this.draw(time);
    this.raf = requestAnimationFrame(this.loop);
  };

  private resize(): void {
    const canvas = this.canvasRef.nativeElement;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = Math.floor(this.width * this.dpr);
    canvas.height = Math.floor(this.height * this.dpr);
    canvas.style.width = `${this.width}px`;
    canvas.style.height = `${this.height}px`;
    this.ctx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.seed();
    if (this.reduced) this.draw(0);
  }

  private seed(): void {
    const count = Math.min(230, Math.max(90, Math.round((this.width * this.height) / 9000)));
    const palette: Star['hue'][] = ['white', 'white', 'white', 'cyan', 'violet'];
    this.stars = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.25 + 0.25,
      alpha: Math.random() * 0.6 + 0.25,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.0008 + 0.0002,
      hue: palette[Math.floor(Math.random() * palette.length)],
    }));
  }

  private spawnStreak(): void {
    const fromTop = Math.random() > 0.4;
    this.streaks.push({
      x: Math.random() * this.width * 1.1,
      y: fromTop ? -20 : Math.random() * this.height * 0.4,
      vx: -(Math.random() * 3.5 + 3),
      vy: Math.random() * 2.6 + 1.8,
      life: 0,
      max: 50 + Math.random() * 40,
    });
  }

  private draw(time: number): void {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.globalCompositeOperation = 'lighter';

    const scroll = window.scrollY || 0;
    for (const star of this.stars) {
      const twinkle = this.reduced
        ? 1
        : 0.55 + 0.45 * Math.sin(time * star.speed + star.phase);
      const x = star.x * this.width;
      const y = (star.y * this.height + scroll * 0.018) % (this.height + 10);
      ctx.beginPath();
      ctx.fillStyle =
        star.hue === 'cyan'
          ? `rgba(165, 243, 252, ${star.alpha * twinkle})`
          : star.hue === 'violet'
            ? `rgba(196, 181, 253, ${star.alpha * twinkle})`
            : `rgba(255, 255, 255, ${star.alpha * twinkle})`;
      ctx.arc(x, y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const streak of this.streaks) {
      streak.life += 1;
      streak.x += streak.vx;
      streak.y += streak.vy;
      const fade = Math.max(0, 1 - streak.life / streak.max);
      const len = 26 + 46 * fade;
      const grad = ctx.createLinearGradient(
        streak.x,
        streak.y,
        streak.x - streak.vx * (len / 6),
        streak.y - streak.vy * (len / 6),
      );
      grad.addColorStop(0, `rgba(255, 255, 255, ${0.85 * fade})`);
      grad.addColorStop(0.35, `rgba(167, 243, 208, ${0.45 * fade})`);
      grad.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(streak.x, streak.y);
      ctx.lineTo(streak.x - streak.vx * 7, streak.y - streak.vy * 7);
      ctx.stroke();
    }

    this.streaks = this.streaks.filter((s) => s.life < s.max);
    ctx.globalCompositeOperation = 'source-over';
  }
}
