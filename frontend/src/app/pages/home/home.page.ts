import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { I18nService } from '../../core/services/i18n.service';
import { SeoService } from '../../core/services/seo.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { CounterComponent } from '../../shared/ui/counter.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { ImgComponent } from '../../shared/ui/image.component';
import { QuoteCtaComponent } from '../../shared/ui/quote-cta.component';
import { VideoModalComponent } from '../../shared/ui/video-modal.component';

type Filter = string;

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    IconComponent,
    ImgComponent,
    RevealDirective,
    CounterComponent,
    QuoteCtaComponent,
    VideoModalComponent,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  readonly i18n = inject(I18nService);
  readonly content = inject(ContentService);
  private readonly seo = inject(SeoService);

  readonly filter = signal<Filter>('all');
  readonly videoOpen = signal(false);

  readonly categories = computed(() => [
    { key: 'all', label: this.i18n.t('common.all') },
    ...this.content
      .projectCategories()
      .map((category) => ({ key: category.key, label: this.i18n.loc(category.fr, category.en) })),
  ]);

  readonly filteredProjects = computed(() => {
    const filter = this.filter();
    const projects = this.content.featuredProjects();
    return filter === 'all' ? projects : projects.filter((project) => project.category === filter);
  });

  readonly included = computed(() => [
    this.i18n.t('conference.photo'),
    this.i18n.t('conference.video'),
    this.i18n.t('conference.streaming'),
    this.i18n.t('conference.interviews'),
    this.i18n.t('conference.aftermovie'),
  ]);

  readonly commitments = computed(() => [
    { title: this.i18n.t('home.quality.item1'), text: this.i18n.t('home.quality.item1d') },
    { title: this.i18n.t('home.quality.item2'), text: this.i18n.t('home.quality.item2d') },
    { title: this.i18n.t('home.quality.item3'), text: this.i18n.t('home.quality.item3d') },
    { title: this.i18n.t('home.quality.item4'), text: this.i18n.t('home.quality.item4d') },
  ]);

  constructor() {
    this.seo.set({
      title: 'SELECTA EMPIRE LIMITED — WE CREATE. WE CAPTURE. WE INSPIRE.',
      description:
        'Agence événementielle et maison de production audiovisuelle : couverture de conférences, captation multicaméra, streaming, photographie corporate et communication visuelle.',
      image: '/images/hero-conference-1600.webp',
      jsonLd: this.seo.organizationSchema(),
    });
  }

  setFilter(key: Filter): void {
    this.filter.set(key);
  }

  playShowreel(): void {
    this.videoOpen.set(true);
  }
}
