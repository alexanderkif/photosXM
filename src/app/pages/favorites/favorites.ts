import { Component, inject } from '@angular/core';
import { FavoritesService } from '../../services/favorites-service';
import { Photo } from '../../types/types';
import { Router } from '@angular/router';
import { PhotoList } from '../../components/photo-list/photo-list';

@Component({
  selector: 'app-favorites',
  imports: [PhotoList],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  protected readonly favoritesService = inject(FavoritesService);
  private router = inject(Router);
  protected readonly emptyLabel = 'No favorite photos found.';

  onCardClick(photo: Photo): void {
    this.router.navigate([`/photos/${photo.id}`]);
  }
}
