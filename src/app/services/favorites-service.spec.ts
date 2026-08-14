import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

import { FavoritesService } from './favorites-service';
import { mockPhoto, STORAGE_KEY_FAVORITES } from '../types/constants';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let appRef: ApplicationRef;

  let store: Record<string, string> = {};

  const mockLocalStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };

  const mockWindow = {
    localStorage: mockLocalStorage,
  };

  const flushAngularEffects = () => {
    appRef.tick();
  };

  async function configureService(customDocument?: any) {
    TestBed.resetTestingModule();

    const docMock = customDocument || {
      ...document,
      defaultView: mockWindow,
    };

    await TestBed.configureTestingModule({
      providers: [FavoritesService, { provide: DOCUMENT, useValue: docMock }],
    }).compileComponents();

    appRef = TestBed.inject(ApplicationRef);
    service = TestBed.inject(FavoritesService);
  }

  beforeEach(() => {
    store = {};
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
  });

  describe('Core functionality in browser', () => {
    beforeEach(async () => {
      await configureService();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should add a favorite and persist it to storage', () => {
      const result = service.addFavorite(mockPhoto);

      flushAngularEffects();

      expect(result).toBe(true);
      expect(service.isFavorite(mockPhoto.id)).toBe(true);
      expect(service.favorites()).toEqual([mockPhoto]);
      expect(store[STORAGE_KEY_FAVORITES]).toBe(JSON.stringify([mockPhoto]));
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
      expect(store[STORAGE_KEY_FAVORITES]).toBe(JSON.stringify([]));
    });
  });

  describe('Initialization from storage', () => {
    it('should load favorites from storage on initialization', async () => {
      const savedPhoto = { ...mockPhoto, id: '2' };
      store[STORAGE_KEY_FAVORITES] = JSON.stringify([savedPhoto]);

      await configureService();

      expect(service.favorites()).toEqual([savedPhoto]);
    });
  });

  describe('Boundary conditions (SSR environment)', () => {
    it('should safely initialize and work if defaultView is null', async () => {
      const docWithNoView = { ...document, defaultView: null };

      await configureService(docWithNoView);

      expect(service.favorites()).toEqual([]);

      expect(service.addFavorite(mockPhoto)).toBe(true);
      expect(() => flushAngularEffects()).not.toThrow();
    });

    it('should work safely if localStorage is absent in window', async () => {
      const windowWithNoStorage = { localStorage: null };
      const docWithNoStorage = { ...document, defaultView: windowWithNoStorage };

      await configureService(docWithNoStorage);

      expect(service.favorites()).toEqual([]);

      service.addFavorite(mockPhoto);
      expect(() => flushAngularEffects()).not.toThrow();
    });
  });
});
