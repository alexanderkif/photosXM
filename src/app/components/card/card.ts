import { Component, input, output, signal, inject, afterNextRender } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Photo } from '../../types/types';
import { IMAGE_WIDTH_PX, IMAGE_HEIGHT_PX } from '../../types/constants';
import { SettingsService } from '../../services/settings-service';

@Component({
  selector: 'app-card',
  imports: [MatCardModule, NgOptimizedImage],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  host: {
    '[style.--card-width]': 'width + "px"',
    '[style.--image-aspect-ratio]': 'width + "/" + height',
  },
})
export class Card {
  photo = input<Photo>();
  clickCard = output<Photo>();
  width = IMAGE_WIDTH_PX;
  height = IMAGE_HEIGHT_PX;

  isLoaded = signal<boolean>(false);
  private readonly settings = inject(SettingsService);

  constructor() {
    afterNextRender(() => {
      // Simulate API delay
      setTimeout(
        () => this.isLoaded.set(true),
        Math.random() * this.settings.delayMs(), // Random delay between 0 and delayMs
      );
    });
  }

  onCardClick(photo: Photo): void {
    this.clickCard.emit(photo);
  }
}
