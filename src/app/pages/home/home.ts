import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Photo } from '../../types/types';
import { Card } from '../../components/card/card';
import { PhotoService } from '../../services/photo-service';
import { IntersectDirective } from '../../directives/intersect-directive';
import { delay } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FavoritesService } from '../../services/favorites-service';

@Component({
  selector: 'app-home',
  imports: [Card, MatProgressSpinnerModule, MatSnackBarModule, IntersectDirective],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly photoService = inject(PhotoService);
  protected readonly favoritesService = inject(FavoritesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(MatSnackBar);
  readonly photos = signal<Photo[]>([]);
  readonly isLoading = signal<boolean>(false);

  private currentPage = 1;

  ngOnInit() {
    this.loadNextPage();
  }

  onCardClick(photo: Photo): void {
    const wasAdded = this.favoritesService.addFavorite(photo);

    this.snackBar.open(
      wasAdded ? 'Photo added to favorites.' : 'This photo was already added to favorites.',
      'Close',
      {
        duration: 2500,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: wasAdded ? ['snackbar-success'] : ['snackbar-error'],
      },
    );
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
