import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Header } from './header';
import { SettingsService } from '../../services/settings-service';
import { signal, ANIMATION_MODULE_TYPE } from '@angular/core';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let mockSettingsService: any;
  let delaySignal: any;

  beforeEach(async () => {
    const { routes } = await import('../../app.routes');

    delaySignal = signal<number>(300);
    mockSettingsService = {
      delayMs: delaySignal,
    };

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter(routes),
        { provide: ANIMATION_MODULE_TYPE, useValue: 'NoopAnimations' },
        { provide: SettingsService, useValue: mockSettingsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;

    fixture.detectChanges();
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
    fixture.detectChanges();

    const photosButton = fixture.nativeElement.querySelector('[routerLink="/"]');
    expect(photosButton.classList.contains('active-link')).toBe(true);
  });

  it('should have active-link class when on favorites page', async () => {
    const router = TestBed.inject(Router);
    await router.navigate(['/favorites']);
    fixture.detectChanges();

    const favoritesButton = fixture.nativeElement.querySelector('[routerLink="/favorites"]');
    expect(favoritesButton.classList.contains('active-link')).toBe(true);
  });

  it('should not have active-link on Photos button when on favorites page', async () => {
    const router = TestBed.inject(Router);
    await router.navigate(['/favorites']);
    fixture.detectChanges();

    const photosButton = fixture.nativeElement.querySelector('[routerLink="/"]');
    expect(photosButton.classList.contains('active-link')).toBe(false);
  });

  describe('Testing delay entry form (Material Input)', () => {
    it('should render mat-form-field with correct attributes', () => {
      const formField = fixture.nativeElement.querySelector('mat-form-field');
      expect(formField).toBeTruthy();
      expect(formField.getAttribute('appearance')).toBe('outline');
      expect(formField.getAttribute('subscriptSizing')).toBe('dynamic');
      expect(formField.classList.contains('delay-input')).toBe(true);
    });

    it('should contain a correct mat-label', () => {
      const label = fixture.nativeElement.querySelector('mat-label');
      expect(label).toBeTruthy();
      expect(label.textContent.trim()).toBe('delay, ms');
    });

    it('should have a number type input with a minimum value constraint', () => {
      const input = fixture.nativeElement.querySelector('input[matInput]');
      expect(input).toBeTruthy();
      expect(input.getAttribute('type')).toBe('number');
      expect(input.getAttribute('min')).toBe('0');
    });

    it('should synchronize the initial input value with the value from SettingsService', async () => {
      const input = fixture.nativeElement.querySelector('input[matInput]') as HTMLInputElement;

      await fixture.whenStable();

      expect(input.value).toBe('300');
    });

    it('should update the input value when the delayMs signal changes in an external service', async () => {
      const input = fixture.nativeElement.querySelector('input[matInput]') as HTMLInputElement;

      delaySignal.set(500);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(input.value).toBe('500');
    });

    it('should invoke the set method on the signal when a new value is entered into the input by a user', async () => {
      const input = fixture.nativeElement.querySelector('input[matInput]') as HTMLInputElement;
      const spySet = vi.spyOn(delaySignal, 'set');

      input.value = '750';
      input.dispatchEvent(new Event('change', { bubbles: true }));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(spySet).toHaveBeenCalledWith(750);
    });
  });
});
