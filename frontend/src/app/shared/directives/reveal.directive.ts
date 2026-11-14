import { Directive, ElementRef, inject, input, OnDestroy, afterNextRender } from '@angular/core';

type RevealKind = 'up' | 'fade' | 'left' | 'right' | 'scale';

/**
 * Adds a performant scroll reveal to any element.
 * Usage: <div [appReveal]="'up'" [revealDelay]="120">…</div>
 */
@Directive({
  selector: '[appReveal]',
  host: {
    '[attr.data-reveal]': 'kind()',
    '[style.--reveal-delay.ms]': 'revealDelay()',
  },
})
export class RevealDirective implements OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  readonly kind = input<RevealKind>('up', { alias: 'appReveal' });
  readonly revealDelay = input<number>(0);

  constructor() {
    afterNextRender(() => {
      const element = this.host.nativeElement as HTMLElement;
      if (!('IntersectionObserver' in window)) {
        element.classList.add('is-visible');
        return;
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add('is-visible');
              this.observer?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      );
      this.observer.observe(element);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
