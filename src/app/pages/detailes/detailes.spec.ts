import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Detailes } from './detailes';
import { FavoritesService } from '../../services/favorites-service';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('Detailes', () => {
  let component: Detailes;
  let fixture: ComponentFixture<Detailes>;
  let favoritesServiceMock: any;

  beforeEach(async () => {
    // Mock for FavoritesService
    favoritesServiceMock = {
      removeFavorite: vi.fn(),
    };

    // Mock for location.href to prevent page reloads during tests
    vi.stubGlobal('location', { href: '' });

    await TestBed.configureTestingModule({
      imports: [Detailes],
      providers: [{ provide: FavoritesService, useValue: favoritesServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Detailes);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect the ID signal input in the template', async () => {
    const testId = '42';
    fixture.componentRef.setInput('id', testId);
    fixture.detectChanges();
    await fixture.whenStable();

    const img = fixture.debugElement.query(By.css('img')).nativeElement;

    // NgOptimizedImage uses ngSrc, in DOM it renders as src
    // We check if the rendered URL contains our ID
    expect(img.getAttribute('src')).toContain(`/id/${testId}/400/600`);
    expect(img.getAttribute('alt')).toBe(`Big image of photo with ID ${testId}`);
  });

  it('should call favoritesService.removeFavorite and redirect when removeFromFavorites is called', () => {
    const testId = '99';

    component.removeFromFavorites(testId);

    expect(favoritesServiceMock.removeFavorite).toHaveBeenCalledWith(testId);
    expect(favoritesServiceMock.removeFavorite).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe('/favorites');
  });

  it('should trigger removeFromFavorites when the remove button is clicked', async () => {
    const testId = '100';
    fixture.componentRef.setInput('id', testId);
    fixture.detectChanges();
    await fixture.whenStable();

    const removeSpy = vi.spyOn(component, 'removeFromFavorites');
    const button = fixture.debugElement.query(By.css('button')).nativeElement;

    button.click();

    fixture.detectChanges();
    expect(removeSpy).toHaveBeenCalledWith(testId);
  });

  it('should have correct dimensions and priority attribute on the image', () => {
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('img')).nativeElement;

    expect(img.getAttribute('width')).toBe('400');
    expect(img.getAttribute('height')).toBe('600');
    // fetchpriority="high" is what "priority" attribute in NgOptimizedImage renders to
    expect(img.getAttribute('fetchpriority')).toBe('high');
  });
});
