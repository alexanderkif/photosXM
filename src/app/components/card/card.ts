import { Component, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Photo } from '../../types/types';

@Component({
  selector: 'app-card',
  imports: [MatCardModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  photo = input<Photo>();

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
    console.log('Кликнули по карточке автора:', photo.author, 'с ID:', photo.id);
  }
}
