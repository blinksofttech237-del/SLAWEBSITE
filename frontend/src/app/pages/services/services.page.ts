import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { I18nService } from '../../core/services/i18n.service';
import { SeoService } from '../../core/services/seo.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { IconComponent } from '../../shared/ui/icon.component';
import { ImgComponent } from '../../shared/ui/image.component';
import { PageHeroComponent } from '../../shared/ui/page-hero.component';
import { QuoteCtaComponent } from '../../shared/ui/quote-cta.component';

@Component({
  selector: 'app-services-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    PageHeroComponent,
    QuoteCtaComponent,
    ImgComponent,
    IconComponent,
    RevealDirective,
  ],
  templateUrl: './services.page.html',
  styleUrl: './services.page.scss',
})
export class ServicesPage {
  readonly i18n = inject(I18nService);
  readonly content = inject(ContentService);
  private readonly seo = inject(SeoService);
  readonly openFaq = signal(0);

  readonly services = computed(() => this.content.services());

  constructor() {
    this.seo.set({
      title: this.i18n.t('services.hero.title'),
      description: this.i18n.t('services.hero.lead'),
      image: '/images/conference-stage-1600.webp',
      path: '/services',
      jsonLd: [
        this.seo.organizationSchema(),
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: this.content.services().map((service, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: service.title,
            url: `/services/${service.slug}`,
          })),
        },
      ],
    });
  }

  detail(slug: string) {
    return this.content.serviceDetail(slug);
  }

  toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? -1 : index));
  }
}
