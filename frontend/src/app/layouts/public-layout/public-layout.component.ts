import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { I18nService } from '../../core/services/i18n.service';
import { IconComponent } from '../../shared/ui/icon.component';
import { ToastsComponent } from '../../shared/ui/toasts.component';
import { CookieBannerComponent } from '../cookie-banner/cookie-banner.component';
import { SiteFooterComponent } from '../site-footer/site-footer.component';
import { SiteHeaderComponent } from '../site-header/site-header.component';

@Component({
  selector: 'app-public-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    SiteHeaderComponent,
    SiteFooterComponent,
    CookieBannerComponent,
    ToastsComponent,
    IconComponent,
  ],
  template: `
    <app-site-header />
    <main id="main-content" class="public-main">
      <router-outlet />
    </main>
    <app-site-footer />
    <app-cookie-banner />
    <app-toasts />

    @if (showTop()) {
      <button type="button" class="back-top" (click)="scrollTop()" [attr.aria-label]="i18n.t('nav.top')">
        <app-icon name="arrow-down" [size]="18" />
      </button>
    }
  `,
  styles: [
    `
      .public-main {
        display: block;
        min-height: 50vh;
      }
      .back-top {
        position: fixed;
        right: 1.25rem;
        bottom: 1.25rem;
        z-index: 900;
        width: 3rem;
        height: 3rem;
        display: grid;
        place-items: center;
        background: var(--ink);
        color: var(--paper);
        border: 1px solid var(--line-light);
        border-radius: 50%;
        box-shadow: var(--shadow-md);
        animation: fadeIn 260ms var(--ease) both;
        transition:
          background var(--dur-fast),
          transform var(--dur-fast);
      }
      .back-top app-icon {
        transform: rotate(180deg);
      }
      .back-top:hover {
        background: var(--empire);
        transform: translateY(-3px);
      }
    `,
  ],
})
export class PublicLayoutComponent {
  readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly showTop = signal(false);

  constructor() {
    this.i18n.syncFromUrl(this.router.url);
    const sub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.i18n.syncFromUrl(event.urlAfterRedirects);
        this.showTop.set(false);
      });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showTop.set(window.scrollY > 900);
  }

  scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
