import { httpResource, HttpResourceRequest } from '@angular/common/http';
import { signal, effect, inject, computed, PLATFORM_ID, Service } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Photo } from '../types/types';
import {
  IMAGE_WIDTH_PX,
  IMAGE_HEIGHT_PX,
  PAGE_LIMIT,
  GRID_MAX_WIDTH_PX,
  CARD_HEIGHT_PX,
  CARD_WIDTH_PX,
  GRID_GAP_PX,
  GRID_PADDING_PX,
  HEADER_HEIGHT_PX,
  MIN_AVAILABLE_HEIGHT_PX,
  PICSUM_API_LIST_ENDPOINT,
  PICSUM_IMAGE_URL_PATTERN,
} from '../types/constants';
import { SettingsService } from '../services/settings-service';

@Service()
export class PhotoService {
  private readonly apiUrl = PICSUM_API_LIST_ENDPOINT;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly settings = inject(SettingsService);

  private readonly page = signal<number>(1);
  private readonly currentLimit = signal<number>(PAGE_LIMIT);
  readonly photos = signal<Photo[]>([]);

  private readonly isFakeLoadingDelay = signal<boolean>(false);
  private readonly lastTriggeredPage = signal<number>(1);

  private calculatedColumns = 1;

  readonly isLoadingDelayed = computed(() => {
    return (
      this.isFakeLoadingDelay() ||
      this.resource.isLoading() ||
      this.page() !== this.lastTriggeredPage()
    );
  });

  readonly resource = httpResource(
    (): HttpResourceRequest => ({
      url: this.apiUrl,
      params: {
        page: this.page().toString(),
        limit: this.currentLimit().toString(),
      },
    }),
    {
      parse: (data: unknown): Photo[] => {
        return (data as Photo[]).map((photo) => ({
          ...photo,
          download_url: this.optimizeImageUrl(photo.id, IMAGE_WIDTH_PX, IMAGE_HEIGHT_PX),
        }));
      },
    },
  );

  constructor() {
    this.calculateInitialLimit();

    effect(() => {
      const newPhotos = this.resource.value();
      if (!newPhotos) return;
      this.photos.update((oldPhotos) => [...oldPhotos, ...newPhotos]);
    });
  }

  private calculateInitialLimit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.document || !this.document.defaultView) {
      return;
    }

    const windowRef = this.document.defaultView;

    const paddingTotalPx = GRID_PADDING_PX * 2;
    const actualWidth = Math.min(windowRef.innerWidth, GRID_MAX_WIDTH_PX);
    const availableWidth = actualWidth - paddingTotalPx;
    const availableHeight = Math.max(
      MIN_AVAILABLE_HEIGHT_PX,
      windowRef.innerHeight - HEADER_HEIGHT_PX,
    );

    this.calculatedColumns = Math.max(
      1,
      Math.floor((availableWidth + GRID_GAP_PX) / (CARD_WIDTH_PX + GRID_GAP_PX)),
    );

    const rows = Math.max(
      1,
      Math.floor((availableHeight + GRID_GAP_PX) / (CARD_HEIGHT_PX + GRID_GAP_PX)) + 1,
    );

    const itemsToFillScreen = this.calculatedColumns * rows;

    let optimalLimit = Math.max(PAGE_LIMIT, itemsToFillScreen);
    const remainder = optimalLimit % this.calculatedColumns;
    if (remainder !== 0) {
      optimalLimit += this.calculatedColumns - remainder;
    }
    this.currentLimit.set(optimalLimit);
  }

  loadNextPage() {
    if (this.isLoadingDelayed()) return;
    if (this.photos().length === 0) return;

    //Emulate real-world API, when getting photos. Loading new photos should have a delay from delayMs.
    this.isFakeLoadingDelay.set(true);

    setTimeout(() => {
      const nextPage = this.page() + 1;
      this.lastTriggeredPage.set(nextPage);
      this.page.set(nextPage);
      this.isFakeLoadingDelay.set(false);
    }, this.settings.delayMs());
  }

  private optimizeImageUrl(id: string, width: number, height: number): string {
    return `${PICSUM_IMAGE_URL_PATTERN}/${id}/${width}/${height}`;
  }
}
