import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { SeoService } from '../../core/services/seo.service';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  template: `
    <section class="notfound on-dark noise">
      <div class="blueprint" aria-hidden="true"></div>
      <div class="shell notfound__inner">
        <span class="eyebrow eyebrow--light">{{ i18n.t('notFound.kicker') }}</span>
        <p class="notfound__code" aria-hidden="true">404</p>
        <h1 class="h1">{{ i18n.t('notFound.title') }}</h1>
        <p class="lead">{{ i18n.t('notFound.desc') }}</p>
        <div class="notfound__actions">
          <a [routerLink]="i18n.path('/')" class="btn btn--lg">
            {{ i18n.t('notFound.back') }}
            <app-icon name="arrow-right" [size]="16" />
          </a>
          <a [routerLink]="i18n.path('/contact')" class="btn btn--ghost btn--lg">
            {{ i18n.t('notFound.contact') }}
          </a>
        </div>
        <div class="notfound__links">
          <a [routerLink]="i18n.path('/services')">{{ i18n.t('nav.services') }}</a>
          <a [routerLink]="i18n.path('/realisations')">{{ i18n.t('nav.projects') }}</a>
          <a [routerLink]="i18n.path('/blog')">{{ i18n.t('nav.blog') }}</a>
          <a [routerLink]="i18n.path('/devis')">{{ i18n.t('cta.quote') }}</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .notfound {
        position: relative;
        min-height: 100svh;
        display: grid;
        place-items: center;
        padding: calc(var(--header-h) + 4rem) 0 4rem;
        overflow: hidden;
      }
      .notfound__inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 1rem;
      }
      .notfound__code {
        font-family: var(--font-display);
        font-size: clamp(8rem, 26vw, 20rem);
        font-weight: 800;
        line-height: 0.8;
        letter-spacing: -0.08em;
        color: transparent;
        -webkit-text-stroke: 1px rgba(244, 241, 233, 0.22);
        margin-block: 0.5rem;
      }
      .notfound .lead {
        max-width: 52ch;
        margin-inline: auto;
      }
      .notfound__actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.7rem;
        margin-top: 1rem;
      }
      .notfound__links {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.6rem 1.5rem;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--line-light);
        font-family: var(--font-alt);
        font-size: 0.7rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--muted-dark);
        width: 100%;
        max-width: 700px;
      }
      .notfound__links a:hover {
        color: var(--paper);
      }
    `,
  ],
})
export class NotFoundPage {
  readonly i18n = inject(I18nService);

  constructor() {
    inject(SeoService).set({
      title: 'Page introuvable — SELECTA EMPIRE LIMITED',
      description: 'La page demandée n’existe pas ou a été déplacée.',
      noindex: true,
      path: '/404',
    });
  }
}
