import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ImgComponent } from './image.component';
import { IconComponent } from './icon.component';

export interface LightboxImage {
  name: string;
  caption?: string;
}

@Component({
  selector: 'app-lightbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ImgComponent, IconComponent],
  template: `
    @if (open()) {
      <div class="lightbox" role="dialog" aria-modal="true" aria-label="Galerie photo">
        <div class="lightbox__bar">
          <span class="lightbox__count">{{ index() + 1 }} / {{ images().length }}</span>
          <span class="lightbox__count">{{ current()?.caption }}</span>
          <button type="button" class="overlay__close" style="position:static" (click)="close()"
            aria-label="Fermer la galerie">
            <app-icon name="close" [size]="18" />
          </button>
        </div>

        <div class="lightbox__stage">
          @if (images().length > 1) {
            <button type="button" class="lightbox__nav lightbox__nav--prev" (click)="prev()" aria-label="Image précédente">
              <app-icon name="chevron-left" [size]="20" />
            </button>
          }
          @if (current(); as image) {
            <app-img
              [name]="image.name"
              [alt]="image.caption || 'Galerie SELECTA EMPIRE'"
              sizes="92vw"
              [priority]="true"
              [width]="1600"
              [height]="1000"
            />
          }
          @if (images().length > 1) {
            <button type="button" class="lightbox__nav lightbox__nav--next" (click)="next()" aria-label="Image suivante">
              <app-icon name="chevron-right" [size]="20" />
            </button>
          }
        </div>

        <div class="lightbox__caption">{{ current()?.caption }}</div>

        @if (images().length > 1) {
          <div class="lightbox__thumbs">
            @for (image of images(); track image.name + $index; let i = $index) {
              <button
                type="button"
                [class.is-active]="i === index()"
                (click)="goTo(i)"
                [attr.aria-label]="'Image ' + (i + 1)"
              >
                <img [src]="thumb(image.name)" alt="" loading="lazy" />
              </button>
            }
          </div>
        }
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }
      app-img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
      }
      .lightbox__stage app-img {
        max-height: calc(100vh - 230px);
      }
      .lightbox__bar app-icon {
        display: inline-flex;
      }
    `,
  ],
})
export class LightboxComponent {
  private readonly doc = inject(DOCUMENT);

  readonly images = input<LightboxImage[]>([]);
  readonly open = input<boolean>(false);
  readonly start = input<number>(0);
  readonly closed = output<void>();

  readonly index = signal(0);

  readonly current = () => this.images()[this.index()];

  constructor() {
    effect(() => {
      if (this.open()) {
        this.index.set(Math.min(Math.max(this.start(), 0), Math.max(this.images().length - 1, 0)));
        this.doc.body.classList.add('no-scroll');
      } else {
        this.doc.body.classList.remove('no-scroll');
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.open()) return;
    if (event.key === 'Escape') this.close();
    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft') this.prev();
  }

  next(): void {
    const length = this.images().length;
    if (!length) return;
    this.index.update((value) => (value + 1) % length);
  }

  prev(): void {
    const length = this.images().length;
    if (!length) return;
    this.index.update((value) => (value - 1 + length) % length);
  }

  goTo(index: number): void {
    this.index.set(index);
  }

  close(): void {
    this.closed.emit();
  }

  thumb(name: string): string {
    return `/images/${name}-800.webp`;
  }
}
