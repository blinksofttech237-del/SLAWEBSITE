import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ display() }}<span class="suffix">{{ suffix() }}</span>`,
  styles: [
    `
      :host {
        font-variant-numeric: tabular-nums;
      }
      .suffix {
        font-size: 0.55em;
        color: var(--empire-soft);
        margin-left: 0.08em;
      }
    `,
  ],
})
export class CounterComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly value = input.required<number>();
  readonly suffix = input<string>('');
  readonly duration = input<number>(1800);
  readonly decimals = input<number>(0);

  readonly display = signal('0');

  constructor() {
    afterNextRender(() => {
      const element = this.host.nativeElement as HTMLElement;
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        this.display.set(this.format(this.value()));
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          this.animate();
        },
        { threshold: 0.4 },
      );
      observer.observe(element);
    });
  }

  private animate(): void {
    const start = performance.now();
    const target = this.value();
    const duration = this.duration();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.display.set(this.format(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else this.display.set(this.format(target));
    };
    requestAnimationFrame(tick);
  }

  private format(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: this.decimals(),
      maximumFractionDigits: this.decimals(),
    }).format(value);
  }
}
