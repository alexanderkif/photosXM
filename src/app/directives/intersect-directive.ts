import {
  Directive,
  ElementRef,
  output,
  afterNextRender,
  input,
  inject,
  PLATFORM_ID,
  DestroyRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appIntersectDirective]',
})
export class IntersectDirective {
  isLoading = input<boolean>(false);
  load = output<void>();

  private observer: IntersectionObserver | null = null;
  private isCurrentlyIntersecting = false;
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender({
      read: () => {
        this.initIntersectionObserver();
      },
    });

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
    });
  }

  private initIntersectionObserver() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.isCurrentlyIntersecting = entry.isIntersecting;

        if (this.isCurrentlyIntersecting && !this.isLoading()) {
          this.tryTriggerLoad();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      },
    );

    this.observer.observe(this.el.nativeElement);
  }

  private tryTriggerLoad() {
    if (!isPlatformBrowser(this.platformId)) return;

    const rect = this.el.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top > windowHeight + 10) {
      return;
    }

    this.load.emit();
  }
}
