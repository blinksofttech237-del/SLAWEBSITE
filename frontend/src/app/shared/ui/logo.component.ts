import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="logo" [class.logo--light]="variant() === 'light'" [style.--logo-size.px]="size()">
      @if (variant() === 'light') {
        <img src="/brand/sla-symbol-inverse.svg" alt="" aria-hidden="true" class="logo__mark" />
      } @else {
        <img src="/brand/sla-badge.svg" alt="" aria-hidden="true" class="logo__mark" />
      }
      <span class="logo__word">
        <span class="logo__name">SELECTA EMPIRE</span>
        <span class="logo__sub">LIMITED</span>
      </span>
    </span>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
      .logo {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        line-height: 1;
        color: var(--ink);
      }
      .logo__mark {
        width: var(--logo-size, 46px);
        height: var(--logo-size, 46px);
        flex: none;
      }
      .logo__word {
        display: flex;
        flex-direction: column;
        gap: 0.18em;
      }
      .logo__name {
        font-family: var(--font-display);
        font-weight: 700;
        font-size: calc(var(--logo-size, 46px) * 0.315);
        letter-spacing: 0.045em;
        white-space: nowrap;
      }
      .logo__sub {
        font-family: var(--font-alt);
        font-weight: 500;
        font-size: calc(var(--logo-size, 46px) * 0.175);
        letter-spacing: 0.42em;
        color: var(--empire);
        padding-left: 0.1em;
      }
      .logo--light {
        color: var(--paper);
      }
      .logo--light .logo__sub {
        color: var(--empire-soft);
      }
      @media (max-width: 480px) {
        .logo__name {
          font-size: calc(var(--logo-size, 46px) * 0.29);
        }
      }
    `,
  ],
})
export class LogoComponent {
  readonly variant = input<'dark' | 'light'>('dark');
  readonly size = input<number>(46);
}
