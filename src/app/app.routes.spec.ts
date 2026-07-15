import { describe, expect, it } from 'vitest';
import { routes } from './app.routes';

describe('app routes', () => {
  it('should resolve loadComponent functions', async () => {
    for (const r of routes) {
      if ((r as any).loadComponent) {
        const res = await (r as any).loadComponent();
        expect(res).toBeTruthy();
      }
    }
  });
});
