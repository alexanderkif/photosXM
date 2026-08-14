import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings-service';
import { DOCUMENT } from '@angular/common';
import { ApplicationRef, signal } from '@angular/core';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';
import { STORAGE_KEY_DELAY_MS, DEFAULT_DELAY_MS } from '../types/constants';

describe('SettingsService', () => {
  let service: SettingsService;
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

  async function configureService(customDocument?: any) {
    TestBed.resetTestingModule();

    const docMock = customDocument || {
      ...document,
      defaultView: mockWindow,
    };

    await TestBed.configureTestingModule({
      providers: [SettingsService, { provide: DOCUMENT, useValue: docMock }],
    }).compileComponents();

    appRef = TestBed.inject(ApplicationRef);
    service = TestBed.inject(SettingsService);
  }

  beforeEach(() => {
    vi.useFakeTimers();
    store = {};
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Initialization (loadFromStorage)', () => {
    it('should set the default value if localStorage is empty', async () => {
      await configureService();

      expect(service.delayMs()).toBe(DEFAULT_DELAY_MS);
    });

    it('should load and parse the value from localStorage if it exists', async () => {
      store[STORAGE_KEY_DELAY_MS] = JSON.stringify(500);

      await configureService();

      expect(service.delayMs()).toBe(500);
    });

    it('should initialize safely if document.defaultView is null (SSR)', async () => {
      const docWithNoView = { ...document, defaultView: null };

      await configureService(docWithNoView);

      expect(service.delayMs()).toBe(DEFAULT_DELAY_MS);
    });

    it('should initialize safely if localStorage is missing from the window', async () => {
      const windowWithNoStorage = { localStorage: null };
      const docWithNoStorage = { ...document, defaultView: windowWithNoStorage };

      await configureService(docWithNoStorage);

      expect(service.delayMs()).toBe(DEFAULT_DELAY_MS);
    });
  });

  describe('Storage Synchronization (effect)', () => {
    it('should automatically write the changed delayMs value to localStorage', async () => {
      await configureService();

      service.delayMs.set(1000);

      appRef.tick();

      expect(store[STORAGE_KEY_DELAY_MS]).toBe(JSON.stringify(1000));
    });

    it('should not throw upon signal change if defaultView is missing', async () => {
      const docWithNoView = { ...document, defaultView: null };
      await configureService(docWithNoView);

      service.delayMs.set(1000);

      expect(() => appRef.tick()).not.toThrow();
    });
  });
});
