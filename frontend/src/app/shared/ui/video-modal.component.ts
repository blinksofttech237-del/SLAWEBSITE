import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-video-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    @if (open()) {
      <div class="overlay" role="dialog" aria-modal="true" [attr.aria-label]="caption() || 'Lecteur vidéo'">
        <button type="button" class="overlay__close" (click)="close()" aria-label="Fermer la vidéo">
          <app-icon name="close" [size]="18" />
        </button>

        <div class="video-modal">
          <div class="video-modal__frame">
            @if (embedUrl(); as embed) {
              <iframe
                [src]="embed"
                [title]="caption() || 'Showreel SELECTA EMPIRE'"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowfullscreen
              ></iframe>
            } @else if (videoUrl()) {
              <video [src]="videoUrl()" [poster]="posterUrl()" controls autoplay playsinline></video>
            } @else {
              <div class="video-placeholder">
                <img [src]="posterUrl()" alt="" />
                <div class="video-placeholder__inner">
                  <span class="eyebrow eyebrow--light">SELECTA EMPIRE</span>
                  <p>Showreel officiel à venir</p>
                  <span class="video-placeholder__note">
                    L’emplacement est prêt : ajoutez l’URL de la vidéo officielle depuis le back-office.
                  </span>
                </div>
              </div>
            }
          </div>
          <div class="video-modal__caption">
            <span>{{ caption() || 'Showreel SELECTA EMPIRE' }}</span>
            <span>WE CREATE. WE CAPTURE. WE INSPIRE.</span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .video-placeholder {
        position: absolute;
        inset: 0;
        overflow: hidden;
      }
      .video-placeholder img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.45;
      }
      .video-placeholder__inner {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 0.8rem;
        padding: 2rem;
        background: radial-gradient(ellipse at center, rgba(5, 5, 5, 0.2), rgba(5, 5, 5, 0.85));
      }
      .video-placeholder__inner p {
        font-family: var(--font-display);
        font-size: clamp(1.3rem, 2.4vw, 2rem);
        color: var(--paper);
      }
      .video-placeholder__note {
        font-size: 0.8rem;
        color: var(--muted-dark);
        max-width: 46ch;
      }
    `,
  ],
})
export class VideoModalComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);

  readonly open = input<boolean>(false);
  readonly videoUrl = input<string>('');
  readonly poster = input<string>('conference-stage');
  readonly caption = input<string>('');
  readonly closed = output<void>();

  readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.videoUrl();
    if (!url) return null;
    const youtube = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    if (youtube) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube-nocookie.com/embed/${youtube[1]}?autoplay=1&rel=0&modestbranding=1`,
      );
    }
    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`,
      );
    }
    return null;
  });

  readonly posterUrl = computed(() => {
    const name = this.poster();
    if (!name) return '/images/hero-conference-1600.webp';
    if (name.startsWith('/') || name.startsWith('http')) return name;
    return `/images/${name}-1600.webp`;
  });

  constructor() {
    effect(() => {
      if (this.open()) this.doc.body.classList.add('no-scroll');
      else this.doc.body.classList.remove('no-scroll');
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.open() && event.key === 'Escape') this.close();
  }

  close(): void {
    this.closed.emit();
  }
}
