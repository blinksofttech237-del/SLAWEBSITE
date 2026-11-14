import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { IconComponent } from './icon.component';
import { ImgComponent } from './image.component';

@Component({
  selector: 'app-page-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ImgComponent, IconComponent],
  template: `
    <section class="page-hero on-dark" [attr.aria-labelledby]="'page-hero-title'">
      <div class="page-hero__media">
        <app-img [name]="image()" alt="" sizes="100vw" [priority]="true" [width]="2400" [height]="1400" />
      </div>
      <div class="shell page-hero__inner">
        <nav class="breadcrumb" aria-label="Fil d’Ariane">
          <a [routerLink]="i18n.path('/')">{{ i18n.t('nav.home') }}</a>
          <span class="breadcrumb__sep">/</span>
          @if (parent(); as parentCrumb) {
            <a [routerLink]="i18n.path(parentCrumb.path)">{{ i18n.t(parentCrumb.label) }}</a>
            <span class="breadcrumb__sep">/</span>
          }
          <span>{{ title() }}</span>
        </nav>

        <span class="eyebrow eyebrow--light">{{ kicker() }}</span>
        <h1 id="page-hero-title" class="h1">{{ title() }}</h1>
        @if (lead()) {
          <p class="lead">{{ lead() }}</p>
        }
        @if (meta().length) {
          <div class="page-hero__meta">
            @for (item of meta(); track item) {
              <span>{{ item }}</span>
            }
          </div>
        }
        @if (ctaLabel()) {
          <div class="page-hero__cta">
            <a [routerLink]="i18n.path(ctaPath())" [queryParams]="ctaQueryParams()" class="btn">
              {{ ctaLabel() }}
              <app-icon name="arrow-right" [size]="16" />
            </a>
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .page-hero__cta {
        margin-top: 1.3rem;
      }
    `,
  ],
})
export class PageHeroComponent {
  readonly i18n = inject(I18nService);

  readonly kicker = input<string>('');
  readonly title = input.required<string>();
  readonly lead = input<string>('');
  readonly image = input<string>('hero-conference');
  readonly meta = input<string[]>([]);
  readonly parent = input<{ path: string; label: string } | null>(null);
  readonly ctaLabel = input<string>('');
  readonly ctaPath = input<string>('/devis');
  readonly ctaQueryParams = input<Record<string, string>>({});
}
