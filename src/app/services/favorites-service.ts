import { Service, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Photo } from '../types/types';

@Service()
export class FavoritesService {
  private readonly STORAGE_KEY = 'favorite_photos';

  private document = inject(DOCUMENT);
  private window = this.document.defaultView;

  private favoritesSignal = signal<Photo[]>([]);
  readonly favorites = this.favoritesSignal.asReadonly();

  constructor() {
    this.loadFromStorage();

    effect(() => {
      const items = this.favoritesSignal();
      if (this.window && this.window.localStorage) {
        this.window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      }
    });
  }

  isFavorite(photoId: string): boolean {
    return this.favoritesSignal().some((item) => item.id === photoId);
  }

  addFavorite(photo: Photo): boolean {
    if (!this.isFavorite(photo.id)) {
      this.favoritesSignal.update((current) => [...current, photo]);
      return true;
    }
    return false;
  }

  removeFavorite(photoId: string): void {
    this.favoritesSignal.update((current) => current.filter((item) => item.id !== photoId));
  }

  private loadFromStorage(): void {
    if (this.window && this.window.localStorage) {
      const data = this.window.localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        this.favoritesSignal.set(JSON.parse(data));
      }
    }
  }
}
