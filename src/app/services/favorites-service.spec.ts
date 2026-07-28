import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { FavoritesService } from './favorites-service';
import { mockPhoto } from '../types/constants';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let appRef: ApplicationRef;

  // Хелпер для современной очистки очереди эффектов Angular
  const flushAngularEffects = () => {
    appRef.tick();
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [FavoritesService]
    });
    
    // Инжектим ссылку на приложение для управления жизненным циклом эффектов
    appRef = TestBed.inject(ApplicationRef);
    service = TestBed.inject(FavoritesService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a favorite and persist it to storage', () => {
    service.addFavorite(mockPhoto);

    // Современный способ запустить эффект синхронизации
    flushAngularEffects();

    expect(service.isFavorite(mockPhoto.id)).toBe(true);
    expect(service.favorites()).toEqual([mockPhoto]);
    expect(localStorage.getItem('favorite_photos')).toBe(JSON.stringify([mockPhoto]));
  });

  it('should return true when adding a new favorite and false for duplicates', () => {
    expect(service.addFavorite(mockPhoto)).toBe(true);
    expect(service.addFavorite(mockPhoto)).toBe(false);

    expect(service.favorites()).toHaveLength(1);
  });

  it('should remove a favorite and clear storage when empty', () => {
    service.addFavorite(mockPhoto);
    flushAngularEffects(); 

    service.removeFavorite(mockPhoto.id);
    flushAngularEffects(); 

    expect(service.isFavorite(mockPhoto.id)).toBe(false);
    expect(service.favorites()).toEqual([]);
    expect(localStorage.getItem('favorite_photos')).toBe(JSON.stringify([]));
  });

  it('should load favorites from storage on initialization', () => {
    const savedPhoto = { ...mockPhoto, id: '2' };
    localStorage.setItem('favorite_photos', JSON.stringify([savedPhoto]));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [FavoritesService]
    });
    
    const initializedService = TestBed.inject(FavoritesService);

    expect(initializedService.favorites()).toEqual([savedPhoto]);
  });
});
