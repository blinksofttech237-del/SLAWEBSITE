import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { I18nService } from './i18n.service';

export interface SeoInput {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  publishedAt?: string;
}

const JSONLD_ID = 'sla-structured-data';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly i18n = inject(I18nService);

  set(input: SeoInput): void {
    const fullTitle = input.title.includes('SELECTA EMPIRE')
      ? input.title
      : `${input.title} — SELECTA EMPIRE LIMITED`;
    const description =
      input.description ??
      'Agence événementielle et maison de production audiovisuelle : couverture de conférences, captation multicaméra, streaming, photographie corporate et communication visuelle.';
    const path = input.path ?? this.doc.location.pathname;
    const base = environment.siteUrl.replace(/\/$/, '');
    const image = input.image
      ? input.image.startsWith('http')
        ? input.image
        : `${base}${input.image}`
      : `${base}/images/hero-conference-1600.webp`;
    const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;

    this.titleService.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: input.noindex ? 'noindex, nofollow' : 'index, follow' });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: input.type ?? 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:site_name', content: 'SELECTA EMPIRE LIMITED' });
    this.meta.updateTag({ property: 'og:locale', content: this.i18n.lang() === 'fr' ? 'fr_FR' : 'en_GB' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setCanonical(url);
    this.setAlternates(base, path);

    if (input.jsonLd) {
      this.setJsonLd(input.jsonLd);
    }
  }

  organizationSchema(): Record<string, unknown> {
    const base = environment.siteUrl.replace(/\/$/, '');
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SELECTA EMPIRE LIMITED',
      alternateName: 'SLA',
      url: base,
      slogan: 'WE CREATE. WE CAPTURE. WE INSPIRE.',
      description:
        'Agence événementielle et maison de production audiovisuelle spécialisée dans la couverture de conférences, la production vidéo, la photographie et la communication visuelle.',
      areaServed: 'International',
      knowsAbout: [
        'Couverture de conférences',
        'Production audiovisuelle',
        'Photographie professionnelle',
        'Streaming événementiel',
        'Organisation d’événements',
      ],
    };
  }

  private setCanonical(url: string): void {
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = 'canonical';
      this.doc.head.appendChild(link);
    }
    link.href = url;
  }

  private setAlternates(base: string, path: string): void {
    this.doc.querySelectorAll('link[rel="alternate"][hreflang]').forEach((node) => node.remove());
    const clean = path.replace(/^\/(en|fr)(?=\/|$)/, '') || '/';
    for (const lang of ['fr', 'en'] as const) {
      const link = this.doc.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = `${base}${lang === 'fr' ? '' : '/en'}${clean === '/' ? '/' : clean}`;
      this.doc.head.appendChild(link);
    }
  }

  private setJsonLd(value: Record<string, unknown> | Record<string, unknown>[]): void {
    let script = this.doc.getElementById(JSONLD_ID) as HTMLScriptElement | null;
    if (!script) {
      script = this.doc.createElement('script');
      script.id = JSONLD_ID;
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(value);
  }
}
