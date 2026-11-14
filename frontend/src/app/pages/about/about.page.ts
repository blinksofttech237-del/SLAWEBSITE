import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { SeoService } from '../../core/services/seo.service';
import { ContentService } from '../../core/services/content.service';
import { IconComponent } from '../../shared/ui/icon.component';
import { ImgComponent } from '../../shared/ui/image.component';
import { PageHeroComponent } from '../../shared/ui/page-hero.component';
import { QuoteCtaComponent } from '../../shared/ui/quote-cta.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-about-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeroComponent,
    QuoteCtaComponent,
    IconComponent,
    ImgComponent,
    RevealDirective,
  ],
  templateUrl: './about.page.html',
  styleUrl: './about.page.scss',
})
export class AboutPage {
  readonly i18n = inject(I18nService);
  readonly content = inject(ContentService);
  private readonly seo = inject(SeoService);

  readonly values = computed(() => [
    { icon: 'spark', title: this.i18n.t('about.values.excellence'), text: this.i18n.t('about.values.excellenceD') },
    { icon: 'shield', title: this.i18n.t('about.values.discretion'), text: this.i18n.t('about.values.discretionD') },
    { icon: 'design', title: this.i18n.t('about.values.creativity'), text: this.i18n.t('about.values.creativityD') },
    { icon: 'check', title: this.i18n.t('about.values.reliability'), text: this.i18n.t('about.values.reliabilityD') },
  ]);

  readonly differentiators = computed(() => [
    this.i18n.t('conference.team.point1'),
    this.i18n.t('conference.team.point2'),
    this.i18n.t('conference.team.point3'),
    this.i18n.t('conference.team.point4'),
  ]);

  readonly openFaq = signal(0);

  constructor() {
    this.seo.set({
      title: this.i18n.t('about.hero.title'),
      description: this.i18n.t('about.hero.lead'),
      image: '/images/team-collab-1600.webp',
      path: '/a-propos',
      jsonLd: this.seo.organizationSchema(),
    });
  }

  toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? -1 : index));
  }
}
