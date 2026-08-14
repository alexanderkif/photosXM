import { Component, inject } from '@angular/core';
import { Photo } from '../../types/types';
import { PhotoService } from '../../services/photo-service';
import { IntersectDirective } from '../../directives/intersect-directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FavoritesService } from '../../services/favorites-service';
import { PhotoList } from '../../components/photo-list/photo-list';
import { SettingsService } from '../../services/settings-service';
import {
  SNACKBAR_CLASS_SUCCESS,
  SNACKBAR_CLASS_ERROR,
  SNACKBAR_MESSAGE_ADDED_SUCCESS,
  SNACKBAR_MESSAGE_ALREADY_ADDED,
  SNACKBAR_ACTION_CLOSE,
  SNACKBAR_DURATION_MS,
  SNACKBAR_HORIZONTAL_POSITION,
  SNACKBAR_VERTICAL_POSITION,
} from '../../types/constants';

@Component({
  selector: 'app-home',
  imports: [PhotoList, MatProgressSpinnerModule, MatSnackBarModule, IntersectDirective],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly photoService = inject(PhotoService);
  protected readonly favoritesService = inject(FavoritesService);
  protected readonly settings = inject(SettingsService);
  private readonly snackBar = inject(MatSnackBar);

  onCardClick(photo: Photo): void {
    const wasAdded = this.favoritesService.addFavorite(photo);

    this.snackBar.open(
      wasAdded ? SNACKBAR_MESSAGE_ADDED_SUCCESS : SNACKBAR_MESSAGE_ALREADY_ADDED,
      SNACKBAR_ACTION_CLOSE,
      {
        duration: SNACKBAR_DURATION_MS,
        horizontalPosition: SNACKBAR_HORIZONTAL_POSITION,
        verticalPosition: SNACKBAR_VERTICAL_POSITION,
        panelClass: wasAdded ? [SNACKBAR_CLASS_SUCCESS] : [SNACKBAR_CLASS_ERROR],
      },
    );
  }
}
