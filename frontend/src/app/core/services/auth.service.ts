import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AdminUser } from '../models/content.model';
import { ApiService } from './api.service';

const TOKEN_KEY = 'sla.token';
const USER_KEY = 'sla.user';

interface LoginResponse {
  token: string;
  user: AdminUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  readonly token = signal<string | null>(this.read(TOKEN_KEY));
  readonly user = signal<AdminUser | null>(this.readUser());
  readonly isAuthenticated = computed(() => Boolean(this.token()));

  login(email: string, password: string) {
    return this.api.post<LoginResponse>('/auth/login', { email, password }).pipe(
      tap((response) => {
        this.token.set(response.token);
        this.user.set(response.user);
        this.write(TOKEN_KEY, response.token);
        this.write(USER_KEY, JSON.stringify(response.user));
      }),
    );
  }

  logout(redirect = true): void {
    this.api.post('/auth/logout', {}).subscribe({ error: () => undefined });
    this.clear();
    if (redirect) void this.router.navigate(['/admin/login']);
  }

  clear(): void {
    this.token.set(null);
    this.user.set(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
  }

  displayName(): string {
    const user = this.user();
    return user?.name || 'Administrateur';
  }

  initials(): string {
    return this.displayName()
      .split(' ')
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  private read(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private readUser(): AdminUser | null {
    const raw = this.read(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AdminUser;
    } catch {
      return null;
    }
  }

  private write(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  }
}
