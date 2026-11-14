import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { CookieService } from '../../core/services/cookie.service';
import { I18nService } from '../../core/services/i18n.service';
import { IconComponent } from '../../shared/ui/icon.component';
import { LogoComponent } from '../../shared/ui/logo.component';
import { NewsletterComponent } from '../../shared/ui/newsletter.component';

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, LogoComponent, NewsletterComponent],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss',
})
export class SiteFooterComponent {
  readonly i18n = inject(I18nService);
  readonly content = inject(ContentService);
  readonly cookies = inject(CookieService);

  readonly year = new Date().getFullYear();

  readonly navItems = [
    { path: '/', label: 'nav.home' },
    { path: '/a-propos', label: 'nav.about' },
    { path: '/services', label: 'nav.services' },
    { path: '/portfolio', label: 'nav.portfolio' },
    { path: '/realisations', label: 'nav.projects' },
    { path: '/evenements', label: 'nav.events' },
    { path: '/blog', label: 'nav.blog' },
    { path: '/contact', label: 'nav.contact' },
  ];

  scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
