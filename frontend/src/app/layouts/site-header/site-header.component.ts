import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { I18nService } from '../../core/services/i18n.service';
import { IconComponent } from '../../shared/ui/icon.component';
import { LogoComponent } from '../../shared/ui/logo.component';

@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, IconComponent, LogoComponent],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  readonly i18n = inject(I18nService);
  readonly content = inject(ContentService);
  private readonly router = inject(Router);

  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);
  readonly servicesOpen = signal(false);

  readonly navItems = [
    { path: '/', label: 'nav.home', exact: true },
    { path: '/a-propos', label: 'nav.about', exact: false },
    { path: '/services', label: 'nav.services', exact: false, children: true },
    { path: '/portfolio', label: 'nav.portfolio', exact: false },
    { path: '/realisations', label: 'nav.projects', exact: false },
    { path: '/evenements', label: 'nav.events', exact: false },
    { path: '/contact', label: 'nav.contact', exact: false },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    this.syncBody();
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.servicesOpen.set(false);
    this.syncBody();
  }

  setLang(lang: 'fr' | 'en'): void {
    if (lang === this.i18n.lang()) return;
    const base = I18nService.basePath(this.router.url);
    this.i18n.set(lang);
    const target = lang === 'en' ? (base === '/' ? '/en' : `/en${base}`) : base;
    void this.router.navigateByUrl(target);
  }

  navigate(path: string): void {
    this.closeMenu();
    void this.router.navigateByUrl(path);
  }

  private syncBody(): void {
    document.body.classList.toggle('no-scroll', this.menuOpen());
  }
}
