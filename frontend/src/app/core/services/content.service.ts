import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import demo from '../data/demo-content.json';
import {
  ContentBundle,
  EventItem,
  FaqItem,
  Partner,
  Post,
  Project,
  ProjectCategory,
  Service,
  ServiceDetail,
  SiteSettings,
  TeamPole,
  Testimonial,
  QuoteRequest,
  QuoteStatus,
  DashboardStats,
  MediaFile,
} from '../models/content.model';
import { ApiService } from './api.service';
import { I18nService } from './i18n.service';

const FALLBACK = demo as unknown as ContentBundle;

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly api = inject(ApiService);
  private readonly i18n = inject(I18nService);

  private readonly _settings = signal<SiteSettings>(FALLBACK.settings);
  private readonly _services = signal<Service[]>(FALLBACK.services);
  private readonly _serviceDetails = signal<Record<string, ServiceDetail>>(FALLBACK.serviceDetails);
  private readonly _projects = signal<Project[]>(FALLBACK.projects);
  private readonly _events = signal<EventItem[]>(FALLBACK.events);
  private readonly _posts = signal<Post[]>(FALLBACK.posts);
  private readonly _testimonials = signal<Testimonial[]>(FALLBACK.testimonials);
  private readonly _partners = signal<Partner[]>(FALLBACK.partners);
  private readonly _teamPoles = signal<TeamPole[]>(FALLBACK.teamPoles);
  private readonly _faq = signal<FaqItem[]>(FALLBACK.faq);
  private readonly _loading = signal(true);
  private readonly _offline = signal(false);

  readonly settings = this._settings.asReadonly();
  readonly services = computed(() => [...this._services()].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  readonly serviceDetails = this._serviceDetails.asReadonly();
  readonly projects = this._projects.asReadonly();
  readonly events = this._events.asReadonly();
  readonly posts = computed(() =>
    [...this._posts()].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)),
  );
  readonly testimonials = computed(() => this._testimonials().filter((t) => t.approved));
  readonly partners = computed(() => this._partners().filter((p) => p.approved));
  readonly teamPoles = this._teamPoles.asReadonly();
  readonly faq = this._faq.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly offline = this._offline.asReadonly();

  readonly featuredProjects = computed(() => this.projects().filter((p) => p.featured));
  readonly upcomingEvents = computed(() =>
    this.events()
      .filter((e) => e.status === 'upcoming')
      .sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate)),
  );
  readonly pastEvents = computed(() =>
    this.events()
      .filter((e) => e.status === 'past')
      .sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate)),
  );
  readonly projectCategories = computed(() => {
    const map = new Map<ProjectCategory, { key: ProjectCategory; fr: string; en: string }>();
    for (const project of this.projects()) {
      map.set(project.category, {
        key: project.category,
        fr: project.categoryLabel,
        en: project.categoryLabelEn,
      });
    }
    return [...map.values()];
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.api
      .get<ContentBundle>('/content')
      .pipe(
        catchError(() => {
          this._offline.set(true);
          return of(null);
        }),
      )
      .subscribe((bundle) => {
        if (bundle) {
          this.apply(bundle);
          this._offline.set(false);
        }
        this._loading.set(false);
      });
  }

  serviceBySlug(slug: string): Service | undefined {
    return this.services().find((service) => service.slug === slug);
  }

  serviceDetail(slug: string): ServiceDetail | undefined {
    return this.serviceDetails()[slug];
  }

  projectBySlug(slug: string): Project | undefined {
    return this.projects().find((project) => project.slug === slug);
  }

  postBySlug(slug: string): Post | undefined {
    return this.posts().find((post) => post.slug === slug);
  }

  relatedPosts(currentSlug: string, limit = 3): Post[] {
    return this.posts()
      .filter((post) => post.slug !== currentSlug)
      .slice(0, limit);
  }

  relatedProjects(currentSlug: string, limit = 3): Project[] {
    return this.projects()
      .filter((project) => project.slug !== currentSlug)
      .slice(0, limit);
  }

  postCategories(): string[] {
    return [...new Set(this.posts().map((post) => this.i18n.loc(post.category, post.categoryEn)))];
  }

  getStats(): DashboardStats {
    return {
      quotes: 0,
      quotesNew: 0,
      projects: this.projects().length,
      publishedProjects: this.projects().length,
      messages: 0,
      unreadMessages: 0,
      subscribers: 0,
      posts: this.posts().length,
      upcomingEvents: this.upcomingEvents().length,
      recentQuotes: [],
      byStatus: {},
      monthlyQuotes: [],
    };
  }

  /** Gallery images from all projects (used by the portfolio page). */
  portfolioImages(): { name: string; project: Project; caption: string }[] {
    const images: { name: string; project: Project; caption: string }[] = [];
    for (const project of this.projects()) {
      const gallery = project.gallery?.length ? project.gallery : [project.cover];
      gallery.forEach((name, index) => {
        images.push({
          name,
          project,
          caption: `${this.i18n.loc(project.title, project.titleEn)} — ${this.i18n.date(project.date)}`,
        });
      });
    }
    return images;
  }

  private apply(bundle: Partial<ContentBundle>): void {
    if (bundle.settings) this._settings.set(this.mergeSettings(bundle.settings));
    if (bundle.services?.length) this._services.set(bundle.services);
    if (bundle.serviceDetails) this._serviceDetails.set(bundle.serviceDetails);
    if (bundle.projects) this._projects.set(bundle.projects);
    if (bundle.events) this._events.set(bundle.events);
    if (bundle.posts) this._posts.set(bundle.posts);
    if (bundle.testimonials) this._testimonials.set(bundle.testimonials);
    if (bundle.partners) this._partners.set(bundle.partners);
    if (bundle.teamPoles?.length) this._teamPoles.set(bundle.teamPoles);
    if (bundle.faq?.length) this._faq.set(bundle.faq);
  }

  private mergeSettings(incoming: SiteSettings): SiteSettings {
    const base = FALLBACK.settings;
    return {
      ...base,
      ...incoming,
      socials: incoming.socials?.length ? incoming.socials : base.socials,
      stats: incoming.stats?.length ? incoming.stats : base.stats,
      institutionalClients: incoming.institutionalClients?.length
        ? incoming.institutionalClients
        : base.institutionalClients,
      showreel: { ...base.showreel, ...(incoming.showreel ?? {}) },
      seo: { ...base.seo, ...(incoming.seo ?? {}) },
    };
  }
}

export interface QuoteTracking {
  reference: string;
  status: QuoteStatus;
  createdAt: string;
  service: string;
  eventType: string;
  eventDate: string;
}

export interface QuoteAttachmentUpload {
  file: File;
}

export type { QuoteRequest, MediaFile };
