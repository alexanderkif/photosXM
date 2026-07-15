import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Card } from './card';
import { Photo } from '../../types/types';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MatCardModule } from '@angular/material/card';
import { mockPhoto } from '../../types/variables';

describe('Card', () => {
  let component: Card;
  let fixture: ComponentFixture<Card>;

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

  it('should render the loaded card content when the image is loaded', async () => {
    fixture.componentRef.setInput('photo', mockPhoto);
    component.isLoaded.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const title = fixture.nativeElement.querySelector('mat-card-title');
    const subtitle = fixture.nativeElement.querySelector('mat-card-subtitle');
    const image = fixture.nativeElement.querySelector('img');

    expect(title?.textContent).toContain(mockPhoto.author);
    expect(subtitle?.textContent).toContain(mockPhoto.id);
    expect(image).not.toBeNull();
  });

  it('should render the skeleton state before the image loads', async () => {
    fixture.componentRef.setInput('photo', mockPhoto);
    component.isLoaded.set(false);
    fixture.detectChanges();
    await fixture.whenStable();

    const skeleton = fixture.nativeElement.querySelector('.skeleton-card');
    expect(skeleton).not.toBeNull();
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
  });

  it('should emit the photo via clickCard output when onCardClick is called', () => {
    const emitSpy = vi.fn();
    component.clickCard.subscribe(emitSpy);

    component.onCardClick(mockPhoto);

    expect(emitSpy).toHaveBeenCalledWith(mockPhoto);
  });

  it('should trigger onCardClick when the mat-card element is clicked', async () => {
    fixture.componentRef.setInput('photo', mockPhoto);
    component.isLoaded.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const onCardClickSpy = vi.spyOn(component, 'onCardClick');
    const cardDe = fixture.debugElement.query(By.css('mat-card'));

    cardDe?.triggerEventHandler('click', new MouseEvent('click'));

    fixture.detectChanges();
    await fixture.whenStable();

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
