import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IntersectDirective } from './intersect-directive';

describe('IntersectDirective', () => {
  class MockIntersectionObserver {
    public static instances: MockIntersectionObserver[] = [];
    public observe = vi.fn();
    public disconnect = vi.fn();
    public unobserve = vi.fn();

    constructor(public readonly callback: IntersectionObserverCallback) {
      MockIntersectionObserver.instances.push(this);
    }
  }

  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal(
      'IntersectionObserver',
      MockIntersectionObserver as unknown as typeof IntersectionObserver,
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should create an instance', () => {
    const mockElementRef = {
      nativeElement: document.createElement('div'),
    } as ElementRef<HTMLElement>;

    const directive = TestBed.runInInjectionContext(() => new IntersectDirective(mockElementRef));

    expect(directive).toBeTruthy();
  });

  it('should initialize observer and observe the element', () => {
    const mockElementRef = {
      nativeElement: document.createElement('div'),
    } as ElementRef<HTMLElement>;

    const directive = TestBed.runInInjectionContext(() => new IntersectDirective(mockElementRef));

    directive.ngOnInit();

    expect(MockIntersectionObserver.instances).toHaveLength(1);
    expect(MockIntersectionObserver.instances[0].observe).toHaveBeenCalledWith(
      mockElementRef.nativeElement,
    );
  });

  it('should emit when the element becomes intersecting and disconnect on destroy', () => {
    const mockElementRef = {
      nativeElement: document.createElement('div'),
    } as ElementRef<HTMLElement>;

    const directive = TestBed.runInInjectionContext(() => new IntersectDirective(mockElementRef));
    const emitSpy = vi.fn();
    directive.appIntersectDirective.subscribe(emitSpy);

    directive.ngOnInit();
    const observer = MockIntersectionObserver.instances[0];

    observer.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    expect(emitSpy).toHaveBeenCalledTimes(1);

    observer.callback(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    expect(emitSpy).toHaveBeenCalledTimes(1);

    directive.ngOnDestroy();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });
});
