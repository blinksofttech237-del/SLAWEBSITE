import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { I18nService } from '../../../core/services/i18n.service';

type State = 'idle' | 'loading' | 'success' | 'exists' | 'error';

@Component({
  selector: 'app-newsletter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <form class="newsletter" [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <div class="newsletter__form">
        <label class="sr-only" for="newsletter-email">{{ i18n.t('common.email') }}</label>
        <input
          id="newsletter-email"
          type="email"
          class="input"
          formControlName="email"
          [placeholder]="i18n.t('footer.newsletterPlaceholder')"
          autocomplete="email"
        />
        <button type="submit" class="btn" [disabled]="state() === 'loading'">
          {{ state() === 'loading' ? i18n.t('cta.subscribing') : i18n.t('cta.subscribe') }}
        </button>
      </div>
      @if (state() === 'success') {
        <p class="newsletter__msg" role="status">{{ i18n.t('footer.newsletterSuccess') }}</p>
      }
      @if (state() === 'exists') {
        <p class="newsletter__msg" role="status">{{ i18n.t('footer.newsletterExists') }}</p>
      }
      @if (state() === 'error') {
        <p class="newsletter__msg newsletter__msg--error" role="alert">
          {{ i18n.t('footer.newsletterError') }}
        </p>
      }
    </form>
  `,
})
export class NewsletterComponent {
  readonly i18n = inject(I18nService);
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly state = signal<State>('idle');

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.state.set('error');
      return;
    }
    this.state.set('loading');
    this.api.post<{ message: string }>('/newsletter', {
      email: this.form.getRawValue().email,
      locale: this.i18n.lang(),
    }).subscribe({
      next: () => {
        this.state.set('success');
        this.form.reset();
      },
      error: (error: { status?: number }) => {
        this.state.set(error.status === 409 ? 'exists' : 'error');
      },
    });
  }
}
