import { Component, inject } from '@angular/core';
import { Photo } from '../../types/types';
import { PhotoService } from '../../services/photo-service';
import { IntersectDirective } from '../../directives/intersect-directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FavoritesService } from '../../services/favorites-service';
import { PhotoList } from '../../components/photo-list/photo-list';

@Component({
  selector: 'app-home',
  imports: [PhotoList, MatProgressSpinnerModule, MatSnackBarModule, IntersectDirective],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly photoService = inject(PhotoService);
  protected readonly favoritesService = inject(FavoritesService);
  private readonly snackBar = inject(MatSnackBar);

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
}
