import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PhotoService } from './photo-service';
import { PAGE_LIMIT, IMAGE_WIDTH, IMAGE_HEIGHT } from '../types/constants';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';
import { ApplicationRef } from '@angular/core';

describe('PhotoService', () => {
  let service: PhotoService;
  let httpMock: HttpTestingController;
  let appRef: ApplicationRef;

  const mockServerPhotos = [
    { id: '10', author: 'Author 1', width: 100, height: 100, url: '', download_url: 'old_url' },
    { id: '20', author: 'Author 2', width: 100, height: 100, url: '', download_url: 'old_url' },
  ];

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [PhotoService, provideHttpClient(), provideHttpClientTesting()],
    });

    httpMock = TestBed.inject(HttpTestingController);
    appRef = TestBed.inject(ApplicationRef);
    service = TestBed.inject(PhotoService);
  });

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  const expectListRequest = async (page: number) => {
    await vi.advanceTimersByTimeAsync(0);
    appRef.tick();

    return httpMock.expectOne((req) => {
      return (
        req.url === 'https://picsum.photos/v2/list' &&
        req.params.get('page') === page.toString() &&
        req.params.get('limit') === PAGE_LIMIT.toString()
      );
    });
  };

  it('должен загружать первую страницу, мапить URL картинок и обновлять сигнал через эффект', async () => {
    const req = await expectListRequest(1);
    req.flush(mockServerPhotos);

    await vi.advanceTimersByTimeAsync(0);
    appRef.tick();

    const resourceValue = service.resource.value();
    expect(resourceValue).toBeDefined();
    // Исправлен синтаксис обращения к первому элементу массива
    expect(resourceValue?.[0]?.download_url).toBe(
      `https://picsum.photos/id/${mockServerPhotos[0].id}/${IMAGE_WIDTH}/${IMAGE_HEIGHT}`,
    );
    expect(service.photosDelayed()).toBeUndefined();

    // Прокручиваем 1 секунду для delay(1000)
    await vi.advanceTimersByTimeAsync(1000);
    appRef.tick();

    expect(service.photos()).toHaveLength(2);
    expect(service.photos()[0]).toMatchObject({
      id: '10',
      download_url: `https://picsum.photos/id/${mockServerPhotos[0].id}/${IMAGE_WIDTH}/${IMAGE_HEIGHT}`,
    });
  });

  it('должен переключать страницы и добавлять новые фото к существующим (пагинация)', async () => {
    const req1 = await expectListRequest(1);
    req1.flush([mockServerPhotos[0]]); // Передаем только первое фото

    await vi.advanceTimersByTimeAsync(1000);
    appRef.tick();
    expect(service.photos()).toHaveLength(1);

    // Пагинация
    service.loadNextPage();

    const req2 = await expectListRequest(2);
    req2.flush([mockServerPhotos[1]]); // Передаем второе фото

    await vi.advanceTimersByTimeAsync(1000);
    appRef.tick();

    expect(service.photos()).toHaveLength(2);
    expect(service.photos()[0].id).toBe('10');
    expect(service.photos()[1].id).toBe('20');
  });

  it('не должен запрашивать следующую страницу, если в данный момент идет загрузка', async () => {
    // 1. Перехватываем первый запрос (он удаляется из списка pending, но ссылка на него остается в req1)
    const req1 = await expectListRequest(1);
    expect(service.resource.isLoading()).toBe(true);

    // 2. Пытаемся вызвать пагинацию во время загрузки первой страницы
    service.loadNextPage();

    await vi.advanceTimersByTimeAsync(0);
    appRef.tick();

    // 3. Проверяем, что запрос для страницы 2 НЕ был создан.
    // Поскольку req1 уже извлечен, в списке pending не должно остаться вообще ничего.
    const pendingRequests = httpMock.match((req) => req.url === 'https://picsum.photos/v2/list');
    expect(pendingRequests).toHaveLength(0); // <-- Меняем 1 на 0

    // 4. Закрываем первый запрос, чтобы сработал httpMock.verify() в afterEach
    req1.flush([]);
  });
});
