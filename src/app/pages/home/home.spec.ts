import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { Home } from './home';
import { PhotoService } from '../../services/photo-service';
import { FavoritesService } from '../../services/favorites-service';
import { Card } from '../../components/card/card';
import { mockPhoto } from '../../types/constants';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let getPhotosSpy: ReturnType<typeof vi.fn>;
  let addFavoriteSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.useFakeTimers();
    getPhotosSpy = vi.fn();
    addFavoriteSpy = vi.fn();
    globalThis.IntersectionObserver = class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    } as unknown as typeof IntersectionObserver;

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: PhotoService, useValue: { getPhotos: getPhotosSpy } },
        { provide: FavoritesService, useValue: { addFavorite: addFavoriteSpy } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load photos on init and append them to the list', () => {
    getPhotosSpy.mockReturnValue(of([mockPhoto]));

    fixture.detectChanges();
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(getPhotosSpy).toHaveBeenCalledWith(1);
    expect(component.photos()).toEqual([mockPhoto]);
    expect(component.isLoading()).toBe(false);
  });

  it('should stop loading when the request fails', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    getPhotosSpy.mockReturnValue(throwError(() => new Error('Boom')));

    fixture.detectChanges();
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should open a success snackbar when a photo is added to favorites', () => {
    addFavoriteSpy.mockReturnValue(true);
    const snackBarOpenSpy = vi
      .spyOn(component['snackBar'], 'open')
      .mockImplementation(() => undefined as never);

    component.onCardClick(mockPhoto);

    expect(addFavoriteSpy).toHaveBeenCalledWith(mockPhoto);
    expect(snackBarOpenSpy).toHaveBeenCalledWith(
      'Photo added to favorites.',
      'Close',
      expect.objectContaining({
        duration: 2500,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-success'],
      }),
    );
  });

  it('should open an error snackbar when the photo is already in favorites', () => {
    addFavoriteSpy.mockReturnValue(false);
    const snackBarOpenSpy = vi
      .spyOn(component['snackBar'], 'open')
      .mockImplementation(() => undefined as never);

    component.onCardClick(mockPhoto);

    expect(snackBarOpenSpy).toHaveBeenCalledWith(
      'This photo was already added to favorites.',
      'Close',
      expect.objectContaining({
        panelClass: ['snackbar-error'],
      }),
    );
  });

  it('should not request another page while a load is already in progress', () => {
    getPhotosSpy.mockReturnValue(of([mockPhoto]));

    component.loadNextPage();
    component.loadNextPage();
    vi.advanceTimersByTime(1000);

    expect(getPhotosSpy).toHaveBeenCalledTimes(1);
  });

  it('should call onCardClick when app-card emits clickCard', () => {
    getPhotosSpy.mockReturnValue(of([mockPhoto]));
    addFavoriteSpy.mockReturnValue(true);
    const snackBarOpenSpy = vi
      .spyOn(component['snackBar'], 'open')
      .mockImplementation(() => undefined as never);

    fixture.detectChanges();
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    const cardDe = fixture.debugElement.query(By.directive(Card));
    expect(cardDe).toBeTruthy();

    cardDe.triggerEventHandler('clickCard', mockPhoto);
    fixture.detectChanges();

    expect(addFavoriteSpy).toHaveBeenCalledWith(mockPhoto);
    expect(snackBarOpenSpy).toHaveBeenCalled();
  });

  it('should load next page when scroll-trigger emits appIntersectDirective', () => {
    getPhotosSpy.mockReturnValue(of([mockPhoto]));

    fixture.detectChanges();

    const triggerDe = fixture.debugElement.query(By.css('.scroll-trigger'));
    expect(triggerDe).toBeTruthy();

    triggerDe.triggerEventHandler('appIntersectDirective', null);
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(getPhotosSpy).toHaveBeenCalledWith(1);
    expect(component.photos()).toEqual([mockPhoto]);
  });
});
