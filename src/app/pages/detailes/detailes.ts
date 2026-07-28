import { Component, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FavoritesService } from '../../services/favorites-service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

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

  removeFromFavorites(photoId: string): void {
    this.favoritesService.removeFavorite(photoId);
    this.router.navigate(['/favorites']);
  }
}
