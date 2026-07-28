import { Component, input, output } from '@angular/core';
import { Photo } from '../../types/types';
import { Card } from '../card/card';

@Component({
  selector: 'app-photo-list',
  imports: [Card],
  templateUrl: './photo-list.html',
  styleUrl: './photo-list.scss',
})
export class PhotoList {
  readonly photos = input<Photo[]>([]);
  readonly emptyLabel = input<string>('The list is empty.');
  readonly onCardClick = output<Photo>();
}
