import { Photo } from './types';

// ==================== LAYOUT ====================
export const HEADER_HEIGHT_PX = 64;
export const IMAGE_WIDTH_PX = 200;
export const IMAGE_HEIGHT_PX = 300;
export const CARD_WIDTH_PX = 200;
export const CARD_HEIGHT_PX = 370;

export const GRID_MAX_WIDTH_PX = 1200;
export const GRID_PADDING_PX = 16;
export const GRID_GAP_PX = 16;

// Minimum available height for calculations (in px)
export const MIN_AVAILABLE_HEIGHT_PX = 200;

// ==================== PAGINATION ====================
export const PAGE_LIMIT = 10;
export const INITIAL_PAGE = 1;

// ==================== API ====================
export const PICSUM_API_BASE_URL = 'https://picsum.photos';
export const PICSUM_API_LIST_ENDPOINT = `${PICSUM_API_BASE_URL}/v2/list`;
export const PICSUM_IMAGE_URL_PATTERN = `${PICSUM_API_BASE_URL}/id`;

// ==================== LOCAL STORAGE ====================
export const STORAGE_KEY_FAVORITES = 'favorite_photos';
export const STORAGE_KEY_DELAY_MS = 'delay_ms';

// ==================== TIMING ====================
/** Default delay for loading simulation (in milliseconds) */
export const DEFAULT_DELAY_MS = 800;

// ==================== UI CLASSES ====================
export const SNACKBAR_CLASS_SUCCESS = 'snackbar-success';
export const SNACKBAR_CLASS_ERROR = 'snackbar-error';

// ==================== SNACKBAR ====================
export const SNACKBAR_MESSAGE_ADDED_SUCCESS = 'Photo added to favorites.';
export const SNACKBAR_MESSAGE_ALREADY_ADDED = 'This photo was already added to favorites.';
export const SNACKBAR_ACTION_CLOSE = 'Close';
export const SNACKBAR_DURATION_MS = 2500;
export const SNACKBAR_HORIZONTAL_POSITION = 'center';
export const SNACKBAR_VERTICAL_POSITION = 'bottom';

// ==================== LOGGING ====================
export const LOG_PREFIX_GRID_CALC = '[Perfect Grid Calc]';

// ==================== MOCK DATA ====================
export const mockPhoto: Photo = {
  id: '1',
  url: `${PICSUM_API_BASE_URL}/200`,
  author: 'Test Author',
  width: 200,
  height: 200,
  download_url: `${PICSUM_IMAGE_URL_PATTERN}/1/200/200`,
};
