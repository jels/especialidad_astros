import {
  AfterViewInit,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Starfield } from './components/starfield';
import { ALL_MISSIONS } from './data/missions';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Starfield],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  private readonly router = inject(Router);

  protected readonly menuOpen = signal(false);
  protected readonly progress = signal(0);
  protected readonly scrolled = signal(false);
  protected readonly presentationMode = signal(this.router.url.startsWith('/presentacion'));

  protected readonly quickNav = [
    { slug: 'eclipses', label: 'Eclipses' },
    { slug: 'luna-y-mareas', label: 'La Luna' },
    { slug: 'sistema-solar', label: 'Sistema solar' },
    { slug: 'constelaciones', label: 'Constelaciones' },
    { slug: 'via-lactea', label: 'Vía Láctea' },
  ];

  protected readonly menuMissions = ALL_MISSIONS;
  protected readonly footerPrimary = ALL_MISSIONS.slice(0, 6);
  protected readonly footerSecondary = ALL_MISSIONS.slice(6);

  private ticking = false;

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.presentationMode.set(this.router.url.startsWith('/presentacion'));
        if (this.menuOpen()) this.closeMenu();
      });
  }

  ngAfterViewInit(): void {
    this.updateScrollState();
  }

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.updateScrollState();
      this.ticking = false;
    });
  }

  @HostListener('window:keydown.escape')
  protected onEscape(): void {
    this.closeMenu();
  }

  private updateScrollState(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.progress.set(max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0);
    this.scrolled.set(scrollTop > 24);
  }

  protected openMenu(): void {
    this.menuOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    document.body.style.overflow = '';
  }
}
