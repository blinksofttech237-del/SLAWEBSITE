import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { SeoService } from '../../core/services/seo.service';
import { ContentService } from '../../core/services/content.service';
import { IconComponent } from '../../shared/ui/icon.component';
import { PageHeroComponent } from '../../shared/ui/page-hero.component';

@Component({
  selector: 'app-legal-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeroComponent, IconComponent],
  template: `
    <app-page-hero
      [kicker]="i18n.t('legal.hero.kicker')"
      [title]="i18n.t('legal.hero.title')"
      [lead]="i18n.t('legal.intro')"
      image="office-meeting"
    />

    <section class="section section--paper">
      <div class="shell legal-page__body">
        <aside class="legal-page__aside">
          <span class="legal-page__aside-title">{{ i18n.t('common.quickLinks') }}</span>
          <nav class="legal-page__nav">
            <a href="#editor">{{ i18n.t('legal.editor') }}</a>
            <a href="#hosting">{{ i18n.t('legal.hosting') }}</a>
            <a href="#property">{{ i18n.t('legal.property') }}</a>
            <a href="#responsibility">{{ i18n.t('legal.responsibility') }}</a>
            <a href="#law">{{ i18n.t('legal.law') }}</a>
            <a href="#contact">{{ i18n.t('legal.contact') }}</a>
          </nav>
          <div class="legal-page__updated">
            <strong>{{ i18n.t('legal.lastUpdate') }}</strong>
            <span>{{ i18n.date(updated) }}</span>
          </div>
        </aside>

        <div>
          <div class="legal-page__notice">
            <app-icon name="shield" [size]="16" />
            <span>{{ i18n.t('legal.intro') }}</span>
          </div>

          <div class="prose">
            <h2 id="editor">{{ i18n.t('legal.editor') }}</h2>
            <p>{{ i18n.t('legal.editorText') }}</p>

            <h2 id="hosting">{{ i18n.t('legal.hosting') }}</h2>
            <p>{{ i18n.t('legal.hostingText') }}</p>

            <h2 id="property">{{ i18n.t('legal.property') }}</h2>
            <p>{{ i18n.t('legal.propertyText') }}</p>

            <h2 id="responsibility">{{ i18n.t('legal.responsibility') }}</h2>
            <p>{{ i18n.t('legal.responsibilityText') }}</p>

            <h2 id="law">{{ i18n.t('legal.law') }}</h2>
            <p>{{ i18n.t('legal.lawText') }}</p>
          </div>

          <div class="legal-page__contact" id="contact">
            <strong>{{ i18n.t('legal.contact') }}</strong>
            <span>{{ i18n.t('legal.contactText') }}</span>
            <a [href]="'mailto:' + content.settings().email">{{ content.settings().email }}</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: '../legal-pages.scss',
})
export class LegalPage {
  readonly i18n = inject(I18nService);
  readonly content = inject(ContentService);
  readonly updated = '2026-01-01';

  constructor() {
    inject(SeoService).set({
      title: 'Mentions légales',
      description: 'Informations légales du site SELECTA EMPIRE LIMITED.',
      image: '/images/office-meeting-1600.webp',
      path: '/mentions-legales',
    });
  }
}
