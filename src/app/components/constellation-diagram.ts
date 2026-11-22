import { Component, computed, input } from '@angular/core';
import {
  ConstellationData,
  ConstellationStar,
} from '../data/constellations';

@Component({
  selector: 'app-constellation-diagram',
  template: `
    <svg
      [attr.viewBox]="viewBox()"
      preserveAspectRatio="xMidYMid meet"
      class="h-full w-full"
      role="img"
      [attr.aria-label]="'Esquema de la constelación ' + constellation().name"
    >
      <!-- Estrellas de fondo -->
      @for (star of fieldStars; track $index) {
        <circle
          [attr.cx]="star.x"
          [attr.cy]="star.y"
          [attr.r]="star.r"
          fill="#e2e8f0"
          [attr.opacity]="star.opacity"
        />
      }

      <!-- Líneas -->
      @for (link of constellation().links; track $index; let i = $index) {
        <line
          class="const-line"
          [attr.x1]="starMap()[link[0]].x"
          [attr.y1]="starMap()[link[0]].y"
          [attr.x2]="starMap()[link[1]].x"
          [attr.y2]="starMap()[link[1]].y"
          [attr.stroke]="constellation().accent"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-opacity=".65"
          [style.animation-delay]="i * 0.09 + 's'"
        />
      }

      <!-- Estrellas -->
      @for (star of constellation().stars; track star.key; let i = $index) {
        <g class="const-star" [style.animation-delay]="0.3 + i * 0.06 + 's'">
          <circle
            [attr.cx]="star.x"
            [attr.cy]="star.y"
            [attr.r]="star.r + 6"
            [attr.fill]="star.color || constellation().accent"
            opacity=".12"
          />
          <circle
            [attr.cx]="star.x"
            [attr.cy]="star.y"
            [attr.r]="star.r"
            [attr.fill]="star.color || '#f8fafc'"
          />
          @if (detailed() && star.label) {
            <text
              [attr.x]="star.x + star.r + 7"
              [attr.y]="star.y + 4"
              fill="rgba(226,232,240,.85)"
              font-size="13"
              font-family="Space Grotesk, sans-serif"
              stroke="#050816"
              stroke-width="4"
              paint-order="stroke"
            >{{ star.name }}</text>
          }
        </g>
      }
    </svg>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .const-line {
        stroke-dasharray: 650;
        stroke-dashoffset: 650;
        animation: drawConst 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }

      .const-star {
        opacity: 0;
        animation: starIn 0.6s ease forwards;
        transform-box: fill-box;
        transform-origin: center;
      }

      @keyframes drawConst {
        to {
          stroke-dashoffset: 0;
        }
      }

      @keyframes starIn {
        from {
          opacity: 0;
          transform: scale(0.4);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
  ],
})
export class ConstellationDiagram {
  readonly constellation = input.required<ConstellationData>();
  readonly detailed = input(false);

  protected readonly starMap = computed<Record<string, ConstellationStar>>(() =>
    Object.fromEntries(this.constellation().stars.map((star) => [star.key, star])),
  );

  protected readonly viewBox = computed(() => {
    const stars = this.constellation().stars;
    const xs = stars.map((star) => star.x);
    const ys = stars.map((star) => star.y);
    const padding = 42;
    const minX = Math.min(...xs) - padding;
    const maxX = Math.max(...xs) + padding + (this.detailed() ? 45 : 15);
    const minY = Math.min(...ys) - padding;
    const maxY = Math.max(...ys) + padding;
    return `${minX} ${minY} ${Math.max(140, maxX - minX)} ${Math.max(140, maxY - minY)}`;
  });

  protected readonly fieldStars = Array.from({ length: 60 }, (_, i) => {
    const x = (Math.sin(i * 91.7 + 2.1) * 0.5 + 0.5) * 400;
    const y = (Math.sin(i * 217.3 + 5.4) * 0.5 + 0.5) * 560;
    return {
      x,
      y,
      r: 0.5 + ((i * 5) % 8) / 14,
      opacity: 0.12 + ((i * 11) % 9) / 40,
    };
  });
}
