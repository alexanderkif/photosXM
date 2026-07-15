import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Photo } from '../types/types';
import { IMAGE_WIDTH, IMAGE_HEIGHT, PAGE_LIMIT } from '../types/variables';

@Service()
export class PhotoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://picsum.photos/v2/list';

  getPhotos(page: number): Observable<Photo[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', PAGE_LIMIT.toString());

    return this.http.get<Photo[]>(this.apiUrl, { params }).pipe(
      map((photos) =>
        photos.map((photo) => ({
          ...photo,
          download_url: this.optimizeImageUrl(photo.id, IMAGE_WIDTH, IMAGE_HEIGHT),
        })),
      ),
    );
  }

  private optimizeImageUrl(id: string, width: number, height: number): string {
    return `https://picsum.photos/id/${id}/${width}/${height}`;
  }
}
