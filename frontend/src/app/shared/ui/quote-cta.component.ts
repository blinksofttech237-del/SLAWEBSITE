import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-quote-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  template: `
    <section class="cta-band" aria-labelledby="cta-title">
      <div class="shell">
        <div class="cta-band__inner">
          <div>
            <span class="eyebrow eyebrow--light">{{ i18n.loc('Prêts à créer ?', 'Ready to create?') }}</span>
            <h2 id="cta-title">{{ i18n.t('home.cta.title') }}</h2>
            <p>{{ i18n.t('home.cta.desc') }}</p>
            <div class="cta-band__actions">
              <a routerLink="/contact" class="btn btn--ghost btn--lg">
                {{ i18n.t('cta.talkProject') }}
                <app-icon name="arrow-right" [size]="17" />
              </a>
              <a routerLink="/devis" class="btn btn--dark btn--lg">
                {{ i18n.t('cta.quote') }}
                <app-icon name="arrow-up-right" [size]="17" />
              </a>
            </div>
          </div>
          <div class="cta-band__side">
            <span class="cta-band__monogram" aria-hidden="true">SLA</span>
            <p class="cta-band__tagline">WE CREATE.<br />WE CAPTURE.<br />WE INSPIRE.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .cta-band__side {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 1rem;
        text-align: right;
      }
      .cta-band__monogram {
        font-family: var(--font-display);
        font-size: clamp(3rem, 6vw, 5rem);
        font-weight: 800;
        letter-spacing: -0.06em;
        line-height: 0.9;
        color: rgba(244, 241, 233, 0.25);
      }
      .cta-band__tagline {
        font-family: var(--font-alt);
        font-size: 0.72rem;
        letter-spacing: 0.18em;
        line-height: 1.9;
        color: rgba(244, 241, 233, 0.65);
        margin: 0;
      }
      .cta-band .eyebrow {
        color: rgba(244, 241, 233, 0.75);
        margin-bottom: 0.9rem;
      }
      .cta-band .eyebrow::before {
        background: rgba(244, 241, 233, 0.6);
      }
      @media (max-width: 900px) {
        .cta-band__side {
          align-items: flex-start;
          text-align: left;
        }
      }
    `,
  ],
})
export class QuoteCtaComponent {
  readonly i18n = inject(I18nService);
}
