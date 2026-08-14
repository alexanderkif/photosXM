import { Component, PLATFORM_ID, signal } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';
import { IntersectDirective } from './intersect-directive';

@Component({
  standalone: true,
  imports: [IntersectDirective],
  template: `
    <div appIntersectDirective (load)="intersectTriggered()" [isLoading]="isLoading()"></div>
  `,
})
class TestHostComponent {
  isLoading = signal(false);
  intersectTriggered = vi.fn();
}

describe('IntersectDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let directiveEl: HTMLElement;
  let mockObserverInstance: MockIntersectionObserver | null = null;

  class MockIntersectionObserver {
    public observe = vi.fn();
    public disconnect = vi.fn();

    constructor(public readonly callback: IntersectionObserverCallback) {
      mockObserverInstance = this;
    }
  }

  async function configureDirective(platform: 'browser' | 'server' = 'browser') {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, IntersectDirective],
      providers: [{ provide: PLATFORM_ID, useValue: platform }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    directiveEl = fixture.nativeElement.querySelector('div');

    fixture.detectChanges();
  }

  beforeEach(() => {
    mockObserverInstance = null;
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('Initialization and Lifecycle', () => {
    it('should create directive instance and start observing', async () => {
      await configureDirective('browser');

      expect(mockObserverInstance).toBeTruthy();
      expect(mockObserverInstance?.observe).toHaveBeenCalledWith(directiveEl);
    });

    it('should disconnect from observer when component is destroyed', async () => {
      await configureDirective('browser');

      fixture.destroy();

      expect(mockObserverInstance?.disconnect).toHaveBeenCalled();
    });
  });

  describe('Trigger logic in browser', () => {
    beforeEach(async () => {
      await configureDirective('browser');
    });

    it('should emit event if element intersects screen, loading is not active and geometry is correct', () => {
      vi.spyOn(directiveEl, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        bottom: 200,
      } as DOMRect);

      mockObserverInstance?.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        mockObserverInstance as unknown as IntersectionObserver,
      );

      expect(component.intersectTriggered).toHaveBeenCalled();
    });

    it('should not emit event if element does not intersect screen', () => {
      mockObserverInstance?.callback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        mockObserverInstance as unknown as IntersectionObserver,
      );

      expect(component.intersectTriggered).not.toHaveBeenCalled();
    });

    it('should not emit event if loading is currently active', () => {
      component.isLoading.set(true);
      fixture.detectChanges();

      mockObserverInstance?.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        mockObserverInstance as unknown as IntersectionObserver,
      );

      expect(component.intersectTriggered).not.toHaveBeenCalled();
    });

    it('should ignore false trigger if top boundary of element is below screen height', () => {
      const windowHeight = window.innerHeight;
      vi.spyOn(directiveEl, 'getBoundingClientRect').mockReturnValue({
        top: windowHeight + 50,
      } as DOMRect);

      mockObserverInstance?.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        mockObserverInstance as unknown as IntersectionObserver,
      );

      expect(component.intersectTriggered).not.toHaveBeenCalled();
    });
  });

  describe('Boundary conditions (SSR)', () => {
    it('should exit tryTriggerLoad and skip geometry check if on server', async () => {
      await configureDirective('server');

      const spyBounds = vi.spyOn(directiveEl, 'getBoundingClientRect');

      mockObserverInstance?.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        mockObserverInstance as unknown as IntersectionObserver,
      );

      expect(spyBounds).not.toHaveBeenCalled();
      expect(component.intersectTriggered).not.toHaveBeenCalled();
    });
  });
});
