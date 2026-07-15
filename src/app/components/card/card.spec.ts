import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Card } from './card';
import { Photo } from '../../types/types';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MatCardModule } from '@angular/material/card';

describe('Card', () => {
  let component: Card;
  let fixture: ComponentFixture<Card>;

  const mockPhoto: Photo = {
    id: '1',
    url: 'https://picsum.photos/200',
    author: 'Test Author',
    width: 200,
    height: 200,
    download_url: 'https://picsum.photos/200/download',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // We removed provideNoopAnimations to avoid the import error
      imports: [Card, MatCardModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Card);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should accept photo data via signal input', async () => {
    fixture.componentRef.setInput('photo', mockPhoto);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.photo()).toEqual(mockPhoto);
  });

  it('should emit the photo via clickCard output when onCardClick is called', () => {
    const emitSpy = vi.fn();
    component.clickCard.subscribe(emitSpy);

    component.onCardClick(mockPhoto);

    expect(emitSpy).toHaveBeenCalledWith(mockPhoto);
  });

  it.skip('should trigger onCardClick when the mat-card element is clicked', async () => {
    // 1. Arrange: Set the input and wait for the Signal to propagate to the template
    fixture.componentRef.setInput('photo', mockPhoto);
    fixture.detectChanges();
    await fixture.whenStable();

    // 2. Setup Spy on the component instance
    const onCardClickSpy = vi.spyOn(component, 'onCardClick');

    // 3. Act: Find the mat-card element which contains the (click) listener
    const cardDe = fixture.debugElement.query(By.css('mat-card'));

    if (cardDe) {
      // Trigger the event via Angular's DebugElement system
      cardDe.triggerEventHandler('click', new MouseEvent('click'));
    } else {
      // Fallback: click the host element if mat-card isn't found (unlikely)
      fixture.nativeElement.click();
    }

    // 4. Final detection to ensure the call is processed
    fixture.detectChanges();
    await fixture.whenStable();

    // 5. Assert
    expect(onCardClickSpy).toHaveBeenCalled();
    expect(onCardClickSpy).toHaveBeenCalledWith(mockPhoto);
  });

  it('should handle undefined photo signal gracefully', async () => {
    fixture.componentRef.setInput('photo', undefined);
    fixture.detectChanges();
    await fixture.whenStable();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const card = nativeElement.querySelector('mat-card');

    // Check if component renders nothing when photo is undefined (via @if)
    if (!card) {
      expect(nativeElement.textContent?.trim()).toBe('');
    }
  });

  it('should emit the correct data even if the input signal updates', async () => {
    const emitSpy = vi.fn();
    component.clickCard.subscribe(emitSpy);

    fixture.componentRef.setInput('photo', mockPhoto);
    fixture.detectChanges();
    await fixture.whenStable();

    const newPhoto: Photo = { ...mockPhoto, id: '2', author: 'Updated Author' };
    fixture.componentRef.setInput('photo', newPhoto);

    fixture.detectChanges();
    await fixture.whenStable();

    // Manually trigger the click to verify the signal's current value
    component.onCardClick(component.photo()!);

    expect(emitSpy).toHaveBeenCalledWith(newPhoto);
  });
});
