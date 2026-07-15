import { Component, input, output, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Photo } from '../../types/types';
import { IMAGE_WIDTH, IMAGE_HEIGHT } from '../../types/variables';

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
  width = IMAGE_WIDTH;
  height = IMAGE_HEIGHT;

  //Emulate real-world API, when getting photos. Loading new photos should have a random delay of 200-300ms.
  isLoaded = signal<boolean>(false);

  ngOnInit() {
    // Simulate API delay
    setTimeout(
      () => {
        this.isLoaded.set(true);
      },
      Math.random() * 800 + 200, // Random delay between 200-1000ms
    );
  }

  onCardClick(photo: Photo): void {
    this.clickCard.emit(photo);
  }
}
