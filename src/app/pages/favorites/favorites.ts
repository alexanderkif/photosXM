import { Component, inject } from '@angular/core';
import { FavoritesService } from '../../services/favorites-service';
import { Card } from '../../components/card/card';
import { Photo } from '../../types/types';

@Component({
  selector: 'app-favorites',
  imports: [Card],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  protected readonly favoritesService = inject(FavoritesService);

  onCardClick(photo: Photo): void {
    location.href = `/photos/${photo.id}`;
  }
}
