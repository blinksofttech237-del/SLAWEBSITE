import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

/**
 * Responsive, lazy image with automatic srcset (800 / 1600 / 2400 px, WebP).
 * The content layer only stores the image key (e.g. "conference-stage").
 */
@Component({
  selector: 'app-img',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img
      [src]="src()"
      [srcset]="srcset()"
      [sizes]="sizes()"
      [alt]="alt()"
      [attr.loading]="priority() ? 'eager' : 'lazy'"
      [attr.fetchpriority]="priority() ? 'high' : 'auto'"
      [attr.width]="width()"
      [attr.height]="height()"
      decoding="async"
      (error)="onError()"
    />
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #121316;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    `,
  ],
})
export class ImgComponent {
  readonly name = input.required<string>();
  readonly alt = input<string>('');
  readonly sizes = input<string>('(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 33vw');
  readonly priority = input<boolean>(false);
  readonly width = input<number>(1600);
  readonly height = input<number>(1000);

  private readonly failed = signal(false);

  readonly src = computed(() => {
    if (this.failed()) return '/images/hero-conference-1600.webp';
    return this.url(1600);
  });

  readonly srcset = computed(() => {
    if (this.failed() || this.isRemote()) return null;
    return `${this.url(800)} 800w, ${this.url(1600)} 1600w, ${this.url(2400)} 2400w`;
  });

  onError(): void {
    this.failed.set(true);
  }

  private isRemote(): boolean {
    return /^(https?:)?\/\//.test(this.name()) || this.name().startsWith('/');
  }

  private url(width: number): string {
    const name = this.name();
    if (!name) return `/images/hero-conference-${width}.webp`;
    if (this.isRemote()) return name;
    return `/images/${name}-${width}.webp`;
  }
}
