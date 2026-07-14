import { Component, input } from '@angular/core';

@Component({
  selector: 'app-detailes',
  imports: [],
  templateUrl: './detailes.html',
  styleUrl: './detailes.scss',
})
export class Detailes {
  protected readonly id = input<string>();
}
