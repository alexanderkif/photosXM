import { httpResource, HttpResourceRequest } from '@angular/common/http';
import { Service, signal, effect } from '@angular/core';
import { Photo } from '../types/types';
import { IMAGE_WIDTH, IMAGE_HEIGHT, PAGE_LIMIT } from '../types/constants';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { delay, of, switchMap } from 'rxjs';

@Service()
export class PhotoService {
  private readonly apiUrl = 'https://picsum.photos/v2/list';

  private readonly page = signal<number>(1);
  readonly photos = signal<Photo[]>([]);

  readonly resource = httpResource(
    (): HttpResourceRequest => ({
      url: this.apiUrl,
      params: {
        page: this.page().toString(),
        limit: PAGE_LIMIT.toString(),
      },
    }),
    {
      parse: (data: unknown): Photo[] =>
        (data as Photo[]).map((photo) => ({
          ...photo,
          download_url: this.optimizeImageUrl(photo.id, IMAGE_WIDTH, IMAGE_HEIGHT),
        })),
    },
  );

  // Emulate network delay for visual testing purposes
  readonly photosDelayed = toSignal(toObservable(this.resource.value).pipe(delay(1000)));
  readonly isLoadingDelayed = toSignal(
    toObservable(this.resource.isLoading).pipe(
      switchMap((isLoading) => {
        if (isLoading) {
          return of(true);
        } else {
          return of(false).pipe(delay(1000));
        }
      }),
    ),
    { initialValue: false },
  );

  constructor() {
    effect(() => {
      const newPhotos = this.photosDelayed(); // use photos() without delay
      if (!newPhotos) return;

      this.photos.update((oldPhotos) => [...oldPhotos, ...newPhotos]);
    });
  }

  loadNextPage() {
    if (this.resource.isLoading()) return;
    this.page.update((n) => n + 1);
  }

  private optimizeImageUrl(id: string, width: number, height: number): string {
    return `https://picsum.photos/id/${id}/${width}/${height}`;
  }
}
