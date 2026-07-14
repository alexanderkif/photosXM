import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Photo } from '../../types/types';
import { Card } from '../../components/card/card';
import { PhotoService } from '../../services/photo-service';
import { IntersectDirective } from '../../directives/intersect-directive';
import { delay } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [Card, MatProgressSpinnerModule, IntersectDirective],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly photoService = inject(PhotoService);
  private readonly destroyRef = inject(DestroyRef);
  readonly photos = signal<Photo[]>([]);
  readonly isLoading = signal<boolean>(false);

  private currentPage = 1;

  ngOnInit() {
    this.loadNextPage();
  }

  loadNextPage() {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.photoService
      .getPhotos(this.currentPage)
      .pipe(
        delay(1000), //Emulate network delay for visual testing purposes
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (newPhotos) => {
          this.photos.update((current) => [...current, ...newPhotos]);
          this.currentPage++;
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Ошибка при загрузке картинок:', err);
          this.isLoading.set(false);
        },
      });
  }
}
