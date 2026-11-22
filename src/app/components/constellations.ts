import {
  Component,
  HostListener,
  OnDestroy,
  computed,
  signal,
} from '@angular/core';
import { RevealDirective } from '../directives/reveal';
import { ConstellationDiagram } from './constellation-diagram';
import { CONSTELLATIONS } from '../data/constellations';

@Component({
  selector: 'app-constellations',
  imports: [RevealDirective, ConstellationDiagram],
  templateUrl: './constellations.html',
  styleUrl: './constellations.css',
})
export class Constellations implements OnDestroy {
  protected readonly constellations = CONSTELLATIONS;
  protected readonly selected = signal<string | null>(null);
  protected readonly modalOpen = signal(false);
  protected readonly workshopId = signal('crux');

  protected readonly workshopData = computed(
    () => this.constellations.find((c) => c.id === this.workshopId()) ?? this.constellations[0],
  );

  protected readonly modalData = computed(
    () => this.constellations.find((c) => c.id === this.selected()) ?? this.constellations[0],
  );

  protected readonly workshopItems = computed(() => [this.workshopData()]);
  protected readonly modalItems = computed(() => [this.modalData()]);

  protected readonly workshopStars = computed(() =>
    this.workshopData().stars.filter((star) => star.label),
  );

  protected readonly workshopTabs = [
    { id: 'crux', name: 'Cruz del Sur', latin: 'Crux', emoji: '✝️' },
    { id: 'orion', name: 'Orión', latin: 'Orion', emoji: '🏹' },
    { id: 'scorpius', name: 'Escorpio', latin: 'Scorpius', emoji: '🦂' },
  ];

  protected openConstellation(id: string): void {
    this.selected.set(id);
    this.modalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  protected closeModal(): void {
    this.modalOpen.set(false);
    document.body.style.overflow = '';
  }

  @HostListener('window:keydown.escape')
  protected onEscape(): void {
    if (this.modalOpen()) this.closeModal();
  }

  protected selectWorkshop(id: string): void {
    this.workshopId.set(id);
  }

  protected workshopGradient(): string {
    const accent = this.workshopData().accent;
    return `radial-gradient(ellipse at 50% 40%, ${accent}16, transparent 68%)`;
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }
}
