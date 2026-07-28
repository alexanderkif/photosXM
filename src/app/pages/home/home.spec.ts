import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';
import { throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { Home } from './home';
import { PhotoService } from '../../services/photo-service';
import { FavoritesService } from '../../services/favorites-service';
import { Card } from '../../components/card/card';
import { mockPhoto } from '../../types/constants';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let mockPhotos: ReturnType<typeof signal>;
  let mockIsLoading: ReturnType<typeof signal>;
  let mockError: ReturnType<typeof signal>;
  let loadNextPageSpy: ReturnType<typeof vi.fn>;
  let addFavoriteSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.useFakeTimers();
    mockPhotos = signal([]);
    mockIsLoading = signal(false);
    mockError = signal<Error | null>(null);
    loadNextPageSpy = vi.fn();
    addFavoriteSpy = vi.fn();

    globalThis.IntersectionObserver = class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    } as unknown as typeof IntersectionObserver;

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        {
          provide: PhotoService,
          useValue: {
            photos: mockPhotos,
            resource: {
              isLoading: mockIsLoading,
              error: mockError,
            },
            isLoadingDelayed: signal(false),
            loadNextPage: loadNextPageSpy,
          },
        },
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

  it('should display photos after they are available', () => {
    mockPhotos.set([mockPhoto]);

    fixture.detectChanges();

    const photoService = (component as any).photoService as PhotoService;
    expect(photoService.photos()).toEqual([mockPhoto]);
    expect(photoService.resource.isLoading()).toBe(false);
  });

  it('should show error state when the resource fails', () => {
    mockError.set(new Error('Boom'));

    fixture.detectChanges();

    const photoService = (component as any).photoService as PhotoService;
    expect(photoService.resource.isLoading()).toBe(false);
    expect(photoService.resource.error()?.message).toBe('Boom');
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

  it('should delegate load next page to the photo service', () => {
    const photoService = (component as any).photoService as PhotoService;
    photoService.loadNextPage();
    photoService.loadNextPage();

    expect(loadNextPageSpy).toHaveBeenCalledTimes(2);
  });
  it('should call onCardClick when app-card emits clickCard', () => {
    addFavoriteSpy.mockReturnValue(true);
    mockPhotos.set([mockPhoto]);
    const snackBarOpenSpy = vi
      .spyOn(component['snackBar'], 'open')
      .mockImplementation(() => undefined as never);

    fixture.detectChanges();

    const cardDe = fixture.debugElement.query(By.directive(Card));
    expect(cardDe).toBeTruthy();

    cardDe.triggerEventHandler('clickCard', mockPhoto);
    fixture.detectChanges();

    expect(addFavoriteSpy).toHaveBeenCalledWith(mockPhoto);
    expect(snackBarOpenSpy).toHaveBeenCalled();
  });

  it('should load next page when scroll-trigger emits appIntersectDirective', () => {
    mockPhotos.set([mockPhoto]);

    fixture.detectChanges();

    const triggerDe = fixture.debugElement.query(By.css('div[appIntersectDirective]'));
    expect(triggerDe).toBeTruthy();

    triggerDe.triggerEventHandler('appIntersectDirective', null);
    fixture.detectChanges();

    expect(loadNextPageSpy).toHaveBeenCalled();
    const photoService = (component as any).photoService as PhotoService;
    expect(photoService.photos()).toEqual([mockPhoto]);
  });
});
