import { Component, DestroyRef, computed, effect, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ALL_MISSIONS } from '../../data/missions';
import { EclipseLab } from '../../components/eclipse-lab';
import { MeteorShower } from '../../components/meteor-shower';
import { LightSpeed } from '../../components/light-speed';
import { MoonTides } from '../../components/moon-tides';
import { CosmicDance } from '../../components/cosmic-dance';
import { SolarSystem } from '../../components/solar-system';
import { FixedStars } from '../../components/fixed-stars';
import { Constellations } from '../../components/constellations';
import { MilkyWay } from '../../components/milky-way';
import { MorningStar } from '../../components/morning-star';
import { ZenithNadir } from '../../components/zenith-nadir';
import { SpaceQuiz } from '../../components/space-quiz';

@Component({
  selector: 'app-mission-page',
  imports: [
    RouterLink,
    EclipseLab,
    MeteorShower,
    LightSpeed,
    MoonTides,
    CosmicDance,
    SolarSystem,
    FixedStars,
    Constellations,
    MilkyWay,
    MorningStar,
    ZenithNadir,
    SpaceQuiz,
  ],
  templateUrl: './mission-page.html',
  styleUrl: './mission-page.css',
})
export class MissionPage {
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('slug') ?? '' },
  );

  protected readonly mission = computed(
    () => ALL_MISSIONS.find((mission) => mission.slug === this.slug()) ?? null,
  );

  protected readonly index = computed(() =>
    ALL_MISSIONS.findIndex((mission) => mission.slug === this.slug()),
  );

  protected readonly previous = computed(() => {
    const index = this.index();
    return index > 0 ? ALL_MISSIONS[index - 1] : null;
  });

  protected readonly next = computed(() => {
    const index = this.index();
    return index >= 0 && index < ALL_MISSIONS.length - 1 ? ALL_MISSIONS[index + 1] : null;
  });

  constructor() {
    effect(() => {
      const mission = this.mission();
      if (mission) {
        this.title.setTitle(
          `${mission.isTest ? 'Test final' : `Misión ${mission.num} · ${mission.title}`} | Cosmos 101`,
        );
      }
    });

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
