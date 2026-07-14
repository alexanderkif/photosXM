import { Service, signal } from '@angular/core';
import { Photo } from '../types/types';

@Service()
export class FavoritesService {
  private readonly STORAGE_KEY = 'favorite_photos';

  private favoritesSignal = signal<Photo[]>(this.loadFromStorage());

  readonly favorites = this.favoritesSignal.asReadonly();

  isFavorite(photoId: string): boolean {
    return this.favoritesSignal().some((item) => item.id === photoId);
  }

  addFavorite(photo: Photo): void {
    const current = this.favoritesSignal();
    if (!this.isFavorite(photo.id)) {
      const updated = [...current, photo];
      this.updateState(updated);
    }
  }

  removeFavorite(photoId: string): void {
    const current = this.favoritesSignal();
    const updated = current.filter((item) => item.id !== photoId);
    this.updateState(updated);
  }

  private updateState(items: Photo[]): void {
    this.favoritesSignal.set(items);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  private loadFromStorage(): Photo[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}
