import {
  Directive,
  ElementRef,
  output,
  afterNextRender,
  afterEveryRender,
  OnDestroy,
  input,
} from '@angular/core';

@Directive({
  selector: '[appIntersectDirective]',
})
export class IntersectDirective implements OnDestroy {
  isLoading = input<boolean>(false);
  appIntersectDirective = output<void>();

  private observer!: IntersectionObserver;
  private isCurrentlyIntersecting = false;

  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      this.initIntersectionObserver();
    });

    afterEveryRender(() => {
      if (this.isCurrentlyIntersecting && !this.isLoading()) {
        this.appIntersectDirective.emit();
      }
    });
  }

  private initIntersectionObserver() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.isCurrentlyIntersecting = entry.isIntersecting;

        if (entry.isIntersecting && !this.isLoading()) {
          this.appIntersectDirective.emit();
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

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
