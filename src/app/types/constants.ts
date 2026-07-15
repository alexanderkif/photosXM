import { Photo } from './types';

export const IMAGE_WIDTH = 200;
export const IMAGE_HEIGHT = 300;

export const PAGE_LIMIT = 15;

export const mockPhoto: Photo = {
  id: '1',
  url: 'https://picsum.photos/200',
  author: 'Test Author',
  width: 200,
  height: 200,
  download_url: 'https://picsum.photos/200/download',
};
