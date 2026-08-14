import { DOCUMENT, effect, inject, Service, signal } from '@angular/core';
import { STORAGE_KEY_DELAY_MS, DEFAULT_DELAY_MS } from '../types/constants';

@Service()
export class SettingsService {
  private readonly STORAGE_KEY = STORAGE_KEY_DELAY_MS;

  private document = inject(DOCUMENT);
  private window = this.document.defaultView;

  readonly delayMs = signal<number>(DEFAULT_DELAY_MS);

  constructor() {
    this.loadFromStorage();

    effect(() => {
      const delay = this.delayMs();
      if (this.window && this.window.localStorage) {
        this.window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(delay));
      }
    });
  }

  private loadFromStorage(): void {
    if (this.window && this.window.localStorage) {
      const data = this.window.localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        this.delayMs.set(+JSON.parse(data));
      }
    }
  }
}
