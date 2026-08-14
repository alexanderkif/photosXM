import { Component, input, output } from '@angular/core';
import { Photo } from '../../types/types';
import { Card } from '../card/card';
import { GRID_MAX_WIDTH_PX } from '../../types/constants';

@Component({
  selector: 'app-photo-list',
  imports: [Card],
  templateUrl: './photo-list.html',
  styleUrl: './photo-list.scss',
  host: {
    '[style.--list-max-width]': 'maxWidth + "px"',
  },
})
export class PhotoList {
  readonly photos = input<Photo[]>([]);
  readonly emptyLabel = input<string>('The list is empty.');
  readonly onCardClick = output<Photo>();
  protected readonly maxWidth = GRID_MAX_WIDTH_PX;
}
