import { ElementRef } from '@angular/core';
import { IntersectDirective } from './intersect-directive';

describe('IntersectDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = {
      nativeElement: document.createElement('div')
    } as ElementRef;

    const directive = new IntersectDirective(mockElementRef);
    expect(directive).toBeTruthy();
  });
});
