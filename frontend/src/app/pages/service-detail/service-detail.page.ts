import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { I18nService } from '../../core/services/i18n.service';
import { SeoService } from '../../core/services/seo.service';
import { ProjectCategory } from '../../core/models/content.model';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { IconComponent } from '../../shared/ui/icon.component';
import { ImgComponent } from '../../shared/ui/image.component';
import { LightboxComponent } from '../../shared/ui/lightbox.component';
import { PageHeroComponent } from '../../shared/ui/page-hero.component';
import { QuoteCtaComponent } from '../../shared/ui/quote-cta.component';

const CATEGORY_MAP: Record<string, ProjectCategory> = {
  'couverture-conferences': 'conferences',
  evenementiel: 'events',
  'production-audiovisuelle': 'video',
  photographie: 'photography',
  'communication-visuelle': 'corporate',
};

@Component({
  selector: 'app-service-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    PageHeroComponent,
    QuoteCtaComponent,
    ImgComponent,
    IconComponent,
    LightboxComponent,
    RevealDirective,
  ],
  templateUrl: './service-detail.page.html',
  styleUrl: './service-detail.page.scss',
})
export class ServiceDetailPage {
  readonly i18n = inject(I18nService);
  readonly content = inject(ContentService);
  private readonly seo = inject(SeoService);

  readonly slug = input<string>('');
  readonly lightboxOpen = signal(false);
  readonly lightboxIndex = signal(0);

  readonly service = computed(() => this.content.serviceBySlug(this.slug()));
  readonly detail = computed(() => this.content.serviceDetail(this.slug()));

  readonly capabilities = computed(() => {
    const detail = this.detail();
    if (!detail) return [];
    return this.i18n.isFrench() ? detail.capabilitiesFr : detail.capabilitiesEn;
  });

  readonly equipment = computed(() => {
    const detail = this.detail();
    if (!detail) return [];
    return this.i18n.isFrench() ? detail.equipmentFr : detail.equipmentEn;
  });

  readonly deliverables = computed(() => {
    const detail = this.detail();
    if (!detail) return [];
    return this.i18n.isFrench() ? detail.deliverablesFr : detail.deliverablesEn;
  });

  readonly relatedProjects = computed(() => {
    const category = CATEGORY_MAP[this.slug()];
    return this.content
      .projects()
      .filter((project) => !category || project.category === category)
      .slice(0, 3);
  });

  readonly gallery = computed(() =>
    this.relatedProjects().flatMap((project) =>
      (project.gallery.length ? project.gallery : [project.cover]).slice(0, 2).map((name) => ({
        name,
        caption: this.i18n.loc(project.title, project.titleEn),
      })),
    ),
  );

  readonly otherServices = computed(() =>
    this.content.services().filter((service) => service.slug !== this.slug()).slice(0, 3),
  );

  readonly steps = computed(() => [
    { num: '01', title: this.i18n.t('process.discovery'), text: this.i18n.t('process.discoveryDesc') },
    { num: '02', title: this.i18n.t('process.planning'), text: this.i18n.t('process.planningDesc') },
    { num: '03', title: this.i18n.t('process.production'), text: this.i18n.t('process.productionDesc') },
    { num: '04', title: this.i18n.t('process.delivery'), text: this.i18n.t('process.deliveryDesc') },
  ]);

  constructor() {
    effect(() => {
      const service = this.service();
      if (!service) return;
      this.seo.set({
        title: `${this.i18n.loc(service.title, service.titleEn)} — SELECTA EMPIRE LIMITED`,
        description: this.i18n.loc(service.excerpt, service.excerptEn),
        image: `/images/${service.image}-1600.webp`,
        path: `/services/${service.slug}`,
        jsonLd: [
          this.seo.organizationSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: this.i18n.loc(service.title, service.titleEn),
            description: this.i18n.loc(service.excerpt, service.excerptEn),
            serviceType: this.i18n.loc(service.title, service.titleEn),
            areaServed: 'International',
          },
        ],
      });
    });
  }

  openLightbox(index: number): void {
    this.lightboxIndex.set(index);
    this.lightboxOpen.set(true);
  }
}
