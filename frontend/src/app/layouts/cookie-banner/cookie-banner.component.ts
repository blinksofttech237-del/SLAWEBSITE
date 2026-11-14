import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CookieService } from '../../core/services/cookie.service';
import { I18nService } from '../../core/services/i18n.service';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-cookie-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.scss',
})
export class CookieBannerComponent {
  readonly i18n = inject(I18nService);
  readonly cookies = inject(CookieService);
  readonly analytics = signal(true);

  acceptAll(): void {
    this.cookies.acceptAll();
  }

  refuseAll(): void {
    this.cookies.refuseAll();
  }

  customize(): void {
    this.cookies.openPreferences();
    this.analytics.set(this.cookies.analytics());
  }

  save(): void {
    this.cookies.saveCustom(this.analytics());
  }
}
