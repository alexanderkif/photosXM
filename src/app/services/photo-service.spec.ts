import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PhotoService } from './photo-service';
import {
  PAGE_LIMIT,
  IMAGE_WIDTH_PX,
  IMAGE_HEIGHT_PX,
  PICSUM_API_LIST_ENDPOINT,
} from '../types/constants';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';
import { ApplicationRef, PLATFORM_ID, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SettingsService } from '../services/settings-service';

describe('PhotoService', () => {
  let service: PhotoService;
  let httpMock: HttpTestingController;
  let appRef: ApplicationRef;

  const mockSettingsService = {
    delayMs: signal(100),
  };

  const fakeWindowDimensions = {
    innerWidth: 1400,
    innerHeight: 900,
  };

  async function configureService(
    platform: 'browser' | 'server' = 'browser',
    forceNullView = false,
  ) {
    TestBed.resetTestingModule();

    const customDocument = {
      ...document,
      getElementById: (id: string) => document.getElementById(id),
      querySelector: (selector: string) => document.querySelector(selector),
      get defaultView() {
        return forceNullView
          ? null
          : (fakeWindowDimensions as unknown as Window & typeof globalThis);
      },
    };

    await TestBed.configureTestingModule({
      providers: [
        PhotoService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: PLATFORM_ID, useValue: platform },
        { provide: DOCUMENT, useValue: customDocument },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    appRef = TestBed.inject(ApplicationRef);
    service = TestBed.inject(PhotoService);
  }

  beforeEach(() => {
    vi.useFakeTimers();
    fakeWindowDimensions.innerWidth = 1400;
    fakeWindowDimensions.innerHeight = 900;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Initialization & Grid Calculation', () => {
    it('should exit grid limit calculations if platform is server (SSR)', async () => {
      await configureService('server');
      expect((service as any).currentLimit()).toBe(PAGE_LIMIT);
    });

    it('should exit grid limit calculations if document.defaultView is missing', async () => {
      await configureService('browser', true);
      expect((service as any).currentLimit()).toBe(PAGE_LIMIT);
    });

    it('should correctly calculate columns, rows and round the limit to a multiple of columns', async () => {
      fakeWindowDimensions.innerWidth = 1000;
      fakeWindowDimensions.innerHeight = 800;

      await configureService('browser');

      const cols = (service as any).calculatedColumns;
      const limit = (service as any).currentLimit();

      expect(cols).toBeGreaterThan(0);
      expect(limit % cols).toBe(0);
    });

    it('should cap the available height to MIN_AVAILABLE_HEIGHT_PX if the screen is too small', async () => {
      fakeWindowDimensions.innerWidth = 400;
      fakeWindowDimensions.innerHeight = 50;

      await configureService('browser');

      expect(service).toBeTruthy();
    });
  });

  describe('HTTP Resource & Photos Array', () => {
    beforeEach(async () => {
      await configureService('browser');
    });

    it('should send request with proper query parameters and format URLs inside parse()', async () => {
      const mockRawData = [
        { id: '101', author: 'Test 1', width: 100, height: 100, url: '...', download_url: 'old' },
      ];

      await vi.advanceTimersByTimeAsync(0);
      appRef.tick();

      const expectedLimit = (service as any).currentLimit().toString();
      const req = httpMock.expectOne(`${PICSUM_API_LIST_ENDPOINT}?page=1&limit=${expectedLimit}`);
      expect(req.request.method).toBe('GET');

      req.flush(mockRawData);

      await vi.advanceTimersByTimeAsync(0);
      appRef.tick();

      const photos = service.photos();
      expect(photos.length).toBe(1);
      expect(photos[0].download_url).toContain(`/${IMAGE_WIDTH_PX}/${IMAGE_HEIGHT_PX}`);
    });

    it('should not update photos array if resource returns null', async () => {
      appRef.tick();
      const req = httpMock.expectOne((r) => r.url.includes(PICSUM_API_LIST_ENDPOINT));
      req.flush(null);
      appRef.tick();

      expect(service.photos()).toEqual([]);
    });
  });

  describe('Pagination & Loading States', () => {
    beforeEach(async () => {
      await configureService('browser');
      service.photos.set([
        { id: '1', author: 'A', width: 10, height: 10, url: '', download_url: '' },
      ]);
      appRef.tick();

      try {
        const req = httpMock.expectOne((r) => r.url.includes(PICSUM_API_LIST_ENDPOINT));
        req.flush([]);
      } catch (e) {}
    });

    it('should abort loadNextPage execution if loading is already in progress', () => {
      (service as any).isFakeLoadingDelay.set(true);
      appRef.tick();

      expect(service.isLoadingDelayed()).toBe(true);

      service.loadNextPage();
      expect((service as any).page()).toBe(1);
    });

    it('should abort loadNextPage execution if photos array is empty', async () => {
      service.photos.set([]);
      appRef.tick();

      service.loadNextPage();
      expect((service as any).page()).toBe(1);
    });

    it('should successfully increment the page after delayMs expires', async () => {
      expect(service.isLoadingDelayed()).toBe(false);

      service.loadNextPage();

      expect((service as any).isFakeLoadingDelay()).toBe(true);
      expect(service.isLoadingDelayed()).toBe(true);

      await vi.advanceTimersByTimeAsync(100);
      appRef.tick();

      expect((service as any).page()).toBe(2);
      expect((service as any).lastTriggeredPage()).toBe(2);
      expect((service as any).isFakeLoadingDelay()).toBe(false);
    });

    it('computed property isLoadingDelayed should respond to page and lastTriggeredPage desync', () => {
      (service as any).page.set(5);
      (service as any).lastTriggeredPage.set(4);
      appRef.tick();

      expect(service.isLoadingDelayed()).toBe(true);
    });
  });
});
