import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { I18nService } from '../../core/services/i18n.service';
import { SeoService } from '../../core/services/seo.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { IconComponent } from '../../shared/ui/icon.component';
import { ImgComponent } from '../../shared/ui/image.component';
import { LightboxComponent } from '../../shared/ui/lightbox.component';
import { PageHeroComponent } from '../../shared/ui/page-hero.component';

@Component({
  selector: 'app-conference-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    PageHeroComponent,
    ImgComponent,
    IconComponent,
    LightboxComponent,
    RevealDirective,
  ],
  templateUrl: './conference.page.html',
  styleUrl: './conference.page.scss',
})
export class ConferencePage {
  readonly i18n = inject(I18nService);
  readonly content = inject(ContentService);
  private readonly seo = inject(SeoService);

  readonly lightboxOpen = signal(false);
  readonly lightboxIndex = signal(0);

  readonly pillars = computed(() => [
    {
      icon: 'camera',
      title: this.i18n.t('conference.photo'),
      text: this.i18n.t('conference.photoD'),
    },
    {
      icon: 'video',
      title: this.i18n.t('conference.video'),
      text: this.i18n.t('conference.videoD'),
    },
    {
      icon: 'stream',
      title: this.i18n.t('conference.streaming'),
      text: this.i18n.t('conference.streamingD'),
    },
    {
      icon: 'mic',
      title: this.i18n.t('conference.interviews'),
      text: this.i18n.t('conference.interviewsD'),
    },
    {
      icon: 'users',
      title: this.i18n.t('conference.dignitaries'),
      text: this.i18n.t('conference.dignitariesD'),
    },
    {
      icon: 'film',
      title: this.i18n.t('conference.aftermovie'),
      text: this.i18n.t('conference.aftermovieD'),
    },
  ]);

  readonly detail = computed(() => this.content.serviceDetail('couverture-conferences'));

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

  readonly teamPoints = computed(() => [
    this.i18n.t('conference.team.point1'),
    this.i18n.t('conference.team.point2'),
    this.i18n.t('conference.team.point3'),
    this.i18n.t('conference.team.point4'),
  ]);

  readonly gallery = computed(() => {
    const projects = this.content.projects().filter((project) => project.category === 'conferences');
    return projects.flatMap((project) =>
      (project.gallery.length ? project.gallery : [project.cover]).map((name) => ({
        name,
        caption: this.i18n.loc(project.title, project.titleEn),
      })),
    );
  });

  readonly openFaq = signal(0);

  constructor() {
    this.seo.set({
      title: this.i18n.t('conference.hero.title'),
      description: this.i18n.t('conference.hero.lead'),
      image: '/images/conference-stage-1600.webp',
      path: '/couverture-conferences',
      jsonLd: [
        this.seo.organizationSchema(),
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Couverture de conférences',
          serviceType: 'Conference coverage, video production, photography and live streaming',
          provider: { '@type': 'Organization', name: 'SELECTA EMPIRE LIMITED' },
          areaServed: 'International',
        },
      ],
    });
  }

  openLightbox(index: number): void {
    this.lightboxIndex.set(index);
    this.lightboxOpen.set(true);
  }

  toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? -1 : index));
  }
}
