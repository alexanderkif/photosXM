import { Component, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FavoritesService } from '../../services/favorites-service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { PICSUM_IMAGE_URL_PATTERN } from '../../types/constants';

@Component({
  selector: 'app-detailes',
  imports: [NgOptimizedImage, MatCardModule, MatButtonModule],
  templateUrl: './detailes.html',
  styleUrl: './detailes.scss',
})
export class Detailes {
  protected readonly favoritesService = inject(FavoritesService);
  protected readonly id = input<string>('');
  private router = inject(Router);

  optimizedImageUrl(): string {
    return `${PICSUM_IMAGE_URL_PATTERN}/${this.id()}/400/600`;
  }

  removeFromFavorites(photoId: string): void {
    this.favoritesService.removeFavorite(photoId);
    this.router.navigate(['/favorites']);
  }
}
