import { computed, DOCUMENT, inject, Injectable, signal } from '@angular/core';
import { Lang } from '../models/content.model';
import { TRANSLATIONS } from '../i18n/translations';

const STORAGE_KEY = 'sla.lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly doc = inject(DOCUMENT);
  private readonly initial: Lang = this.readInitial();

  readonly lang = signal<Lang>(this.initial);
  readonly dict = computed(() => TRANSLATIONS[this.lang()]);
  readonly isFrench = computed(() => this.lang() === 'fr');
  readonly locale = computed(() => (this.lang() === 'fr' ? 'fr-FR' : 'en-GB'));

  constructor() {
    this.apply(this.initial, false);
  }

  set(lang: Lang): void {
    if (lang === this.lang()) return;
    this.lang.set(lang);
    this.apply(lang, true);
  }

  toggle(): void {
    this.set(this.lang() === 'fr' ? 'en' : 'fr');
  }

  t(key: string, params?: Record<string, string | number>): string {
    const value = this.dict()[key] ?? TRANSLATIONS.fr[key] ?? key;
    if (!params) return value;
    return Object.entries(params).reduce(
      (acc, [name, replacement]) => acc.replaceAll(`{${name}}`, String(replacement)),
      value,
    );
  }

  /** Prefixes an internal path for the active language (/en on English URLs). */
  path(path: string): string {
    const clean = path.startsWith('/') ? path : `/${path}`;
    if (this.lang() === 'en') return clean === '/' ? '/en' : `/en${clean}`;
    return clean;
  }

  /** Removes the language prefix from a URL path. */
  static basePath(url: string): string {
    const clean = url.split('?')[0].split('#')[0];
    const stripped = clean.replace(/^\/en(?=\/|$)/, '');
    return stripped === '' ? '/' : stripped;
  }

  /** Applies the language encoded in a URL. */
  syncFromUrl(url: string): void {
    const lang: Lang = /^\/en(\/|$)/.test(url) ? 'en' : 'fr';
    if (lang !== this.lang()) this.set(lang);
  }

  /** Picks the right localized field with a graceful fallback. */
  loc(fr: string | null | undefined, en: string | null | undefined): string {
    const value = this.lang() === 'fr' ? fr : en;
    return (value && value.trim()) || fr || en || '';
  }

  date(value: string | Date | null | undefined, options?: Intl.DateTimeFormatOptions): string {
    if (!value) return '—';
    const date = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat(
      this.locale(),
      options ?? { day: '2-digit', month: 'long', year: 'numeric' },
    ).format(date);
  }

  monthShort(value: string | Date): string {
    const date = typeof value === 'string' ? new Date(value) : value;
    return new Intl.DateTimeFormat(this.locale(), { month: 'short' }).format(date).replace('.', '');
  }

  private apply(lang: Lang, persist: boolean): void {
    this.doc.documentElement.lang = lang;
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        /* storage may be unavailable */
      }
    }
  }

  private readInitial(): Lang {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'fr' || stored === 'en') return stored;
    } catch {
      /* ignore */
    }
    const browser = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'fr';
    return browser.startsWith('en') ? 'en' : 'fr';
  }
}
