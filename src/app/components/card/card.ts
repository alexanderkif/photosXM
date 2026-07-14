import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PhotoData } from '../../types/types';

@Component({
  selector: 'app-card',
  imports: [MatCardModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  photoData = input<PhotoData>();

  onCardClick(data: PhotoData): void {
    console.log('Кликнули по карточке автора:', data.author, 'с ID:', data.id);
  }
}
