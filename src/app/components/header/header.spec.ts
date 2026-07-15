import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    const { routes } = await import('../../app.routes');

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render mat-toolbar with default color', () => {
    const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
    expect(toolbar).toBeTruthy();
    expect(toolbar.getAttribute('color')).toBe('default');
  });

  it('should have header class on the toolbar', () => {
    const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
    expect(toolbar.classList.contains('header')).toBe(true);
  });

  it('should render Photos button with correct routerLink', () => {
    const photosButton = fixture.nativeElement.querySelector('[routerLink="/"]');
    expect(photosButton).toBeTruthy();
    expect(photosButton.textContent.trim()).toBe('Photos');
    expect(photosButton.getAttribute('routerlink')).toContain('/');
  });

  it('should render Favorites button with correct routerLink', () => {
    const favoritesButton = fixture.nativeElement.querySelector('[routerLink="/favorites"]');
    expect(favoritesButton).toBeTruthy();
    expect(favoritesButton.textContent.trim()).toBe('Favorites');
    expect(favoritesButton.getAttribute('routerlink')).toContain('/favorites');
  });

  it('should render exactly two navigation buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('mat-toolbar button[routerLink]');
    expect(buttons.length).toBe(2);
  });

  it('should have active-link class when on home page', async () => {
    const router = TestBed.inject(Router);
    await router.navigate(['/']);

    const photosButton = fixture.nativeElement.querySelector('[routerLink="/"]');
    expect(photosButton.classList.contains('active-link')).toBe(true);
  });

  it('should have active-link class when on favorites page', async () => {
    const router = TestBed.inject(Router);
    await router.navigate(['/favorites']);

    const favoritesButton = fixture.nativeElement.querySelector('[routerLink="/favorites"]');
    expect(favoritesButton.classList.contains('active-link')).toBe(true);
  });

  it('should not have active-link on Photos button when on favorites page', async () => {
    const router = TestBed.inject(Router);
    await router.navigate(['/favorites']);

    const photosButton = fixture.nativeElement.querySelector('[routerLink="/"]');
    expect(photosButton.classList.contains('active-link')).toBe(false);
  });
});
