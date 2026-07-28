import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Favorites } from './favorites';
import { FavoritesService } from '../../services/favorites-service';
import { mockPhoto } from '../../types/constants';
import { Card } from '../../components/card/card';

describe('Favorites', () => {
  let component: Favorites;
  let fixture: ComponentFixture<Favorites>;

  beforeEach(async () => {
    const routerMock = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Favorites],
      providers: [
        { provide: FavoritesService, useValue: { favorites: () => [] } },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Favorites);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the empty state when no favorites exist', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No favorite photos found.');
  });

  it('should navigate to photo detail when card emits clickCard', () => {
    const favoritesService = TestBed.inject(FavoritesService) as any;
    const router = TestBed.inject(Router) as any;
    favoritesService.favorites = () => [mockPhoto];

    fixture.detectChanges();

    const cardDe = fixture.debugElement.query(By.directive(Card));
    expect(cardDe).toBeTruthy();

    cardDe.triggerEventHandler('clickCard', mockPhoto);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([`/photos/${mockPhoto.id}`]);
  });
});
