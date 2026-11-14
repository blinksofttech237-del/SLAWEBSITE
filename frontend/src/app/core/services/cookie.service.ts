import { computed, Injectable, signal } from '@angular/core';

export type ConsentChoice = 'all' | 'necessary' | 'custom' | null;

const KEY = 'sla.cookie-consent';

@Injectable({ providedIn: 'root' })
export class CookieService {
  readonly choice = signal<ConsentChoice>(this.readChoice());
  readonly analytics = signal<boolean>(this.readAnalytics());
  readonly bannerOpen = signal(false);
  readonly preferencesOpen = signal(false);
  readonly hasDecision = computed(() => this.choice() !== null);

  constructor() {
    if (this.choice() === null) {
      setTimeout(() => this.bannerOpen.set(true), 1200);
    }
  }

  acceptAll(): void {
    this.persist('all', true);
    this.bannerOpen.set(false);
  }

  refuseAll(): void {
    this.persist('necessary', false);
    this.bannerOpen.set(false);
  }

  saveCustom(analytics: boolean): void {
    this.persist('custom', analytics);
    this.bannerOpen.set(false);
    this.preferencesOpen.set(false);
  }

  openPreferences(): void {
    this.preferencesOpen.set(true);
  }

  closePreferences(): void {
    this.preferencesOpen.set(false);
  }

  openBanner(): void {
    this.bannerOpen.set(true);
  }

  private persist(choice: ConsentChoice, analytics: boolean): void {
    this.choice.set(choice);
    this.analytics.set(analytics);
    try {
      localStorage.setItem(KEY, JSON.stringify({ choice, analytics, date: new Date().toISOString() }));
    } catch {
      /* ignore */
    }
  }

  private readChoice(): ConsentChoice {
    const stored = this.read();
    return stored ? (stored.choice as ConsentChoice) : null;
  }

  private readAnalytics(): boolean {
    return this.read()?.analytics === true;
  }

  private read(): { choice?: string; analytics?: boolean } | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as { choice?: string; analytics?: boolean }) : null;
    } catch {
      return null;
    }
  }
}
