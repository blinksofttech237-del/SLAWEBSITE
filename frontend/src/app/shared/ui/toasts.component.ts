import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-toasts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div class="toasts" aria-live="polite" aria-atomic="true">
      @for (toast of toasts.toasts(); track toast.id) {
        <div class="toast" [class]="'toast toast--' + toast.type" role="status">
          <app-icon [name]="toast.type === 'error' ? 'shield' : 'check'" [size]="16" />
          <span>{{ toast.message }}</span>
          <button type="button" (click)="toasts.dismiss(toast.id)" aria-label="Fermer">
            <app-icon name="close" [size]="14" />
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toasts {
        position: fixed;
        right: 1.25rem;
        bottom: 1.25rem;
        z-index: 2000;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        max-width: min(380px, calc(100vw - 2.5rem));
        pointer-events: none;
      }
      .toast {
        display: flex;
        align-items: flex-start;
        gap: 0.7rem;
        padding: 0.85rem 1rem;
        background: var(--ink);
        color: var(--paper);
        border-left: 3px solid var(--empire);
        box-shadow: var(--shadow-md);
        font-size: 0.85rem;
        line-height: 1.45;
        pointer-events: auto;
        animation: pageEnter 0.35s var(--ease) both;
      }
      .toast--error {
        border-color: #d64b41;
      }
      .toast app-icon {
        color: var(--empire-soft);
        margin-top: 2px;
      }
      .toast--error app-icon {
        color: #f0a6a0;
      }
      .toast span {
        flex: 1;
      }
      .toast button {
        color: var(--muted-dark);
        display: flex;
        padding: 2px;
      }
      .toast button:hover {
        color: var(--paper);
      }
    `,
  ],
})
export class ToastsComponent {
  readonly toasts = inject(ToastService);
}
