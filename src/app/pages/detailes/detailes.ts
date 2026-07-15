import { Component, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FavoritesService } from '../../services/favorites-service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-detailes',
  imports: [NgOptimizedImage, MatCardModule, MatButtonModule],
  templateUrl: './detailes.html',
  styleUrl: './detailes.scss',
})
export class Detailes {
  protected readonly favoritesService = inject(FavoritesService);
  protected readonly id = input<string>('');

  removeFromFavorites(photoId: string): void {
    this.favoritesService.removeFavorite(photoId);
    location.href = '/favorites';
  }
}
