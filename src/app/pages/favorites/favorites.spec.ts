import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { Favorites } from './favorites';
import { mockPhoto } from '../../types/variables';
import { FavoritesService } from '../../services/favorites-service';

describe('Favorites', () => {
  let component: Favorites;
  let fixture: ComponentFixture<Favorites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Favorites],
      providers: [FavoritesService],
    }).compileComponents();

    fixture = TestBed.createComponent(Favorites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the empty state when no favorites exist', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No favorite photos found.');
  });

  it('should render favorite cards and handle click callback', () => {
    const favoritesService = TestBed.inject(FavoritesService);
    favoritesService.addFavorite(mockPhoto);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('app-card');
    expect(card).not.toBeNull();

    expect(() => component.onCardClick(mockPhoto)).not.toThrow();
  });
});
