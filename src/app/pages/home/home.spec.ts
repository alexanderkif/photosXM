import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { Home } from './home';
import { PhotoService } from '../../services/photo-service';
import { mockPhoto } from '../../types/variables';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let getPhotosSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.useFakeTimers();
    getPhotosSpy = vi.fn();
    globalThis.IntersectionObserver = class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    } as unknown as typeof IntersectionObserver;

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: PhotoService, useValue: { getPhotos: getPhotosSpy } },
        { provide: 'FavoritesService', useValue: { addFavorite: vi.fn() } },
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
});
