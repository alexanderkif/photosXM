import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

import { PhotoService } from './photo-service';
import { mockPhoto } from '../types/constants';

describe('PhotoService', () => {
  let service: PhotoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PhotoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request photos for a given page and map image urls', () => {
    const page = 2;
    let response: Array<typeof mockPhoto> | undefined;

    service.getPhotos(page).subscribe((photos) => {
      response = photos;
    });

    const req = httpMock.expectOne((request) => request.url.includes('picsum.photos/v2/list'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe(page.toString());
    expect(req.request.params.get('limit')).toBe('15');

    req.flush([mockPhoto]);

    expect(response?.[0].download_url).toContain('/id/1/200/300');
  });
});
