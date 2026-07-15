import { Directive, ElementRef, output } from '@angular/core';

@Directive({
  selector: '[appIntersectDirective]',
})
export class IntersectDirective {
  appIntersectDirective = output<void>();
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.appIntersectDirective.emit();
        }
      },
      {
        root: null,
        threshold: 0.1,
      },
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
