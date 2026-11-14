import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  readonly baseUrl = environment.apiBase;

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      }
    }
    return this.http
      .get<T>(`${this.baseUrl}${path}`, { params: httpParams })
      .pipe(catchError((error) => this.handle(error)));
  }

  post<T>(path: string, body: unknown, options?: { withCredentials?: boolean }): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${path}`, body, options)
      .pipe(catchError((error) => this.handle(error)));
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}${path}`, body)
      .pipe(catchError((error) => this.handle(error)));
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .patch<T>(`${this.baseUrl}${path}`, body)
      .pipe(catchError((error) => this.handle(error)));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`).pipe(catchError((error) => this.handle(error)));
  }

  upload<T>(path: string, form: FormData): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, form).pipe(catchError((error) => this.handle(error)));
  }

  /** Direct file URL helper for uploaded media. */
  mediaUrl(url: string): string {
    if (!url) return '';
    if (/^https?:\/\//.test(url)) return url;
    return `${environment.apiOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  private handle(error: unknown): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as { message?: string; errors?: Record<string, string[]> } | null;
      const normalized: ApiError = {
        status: error.status,
        message:
          body?.message ||
          (error.status === 0
            ? 'Service indisponible. Vérifiez votre connexion.'
            : 'La requête n’a pas pu aboutir.'),
        errors: body?.errors,
      };
      return throwError(() => normalized);
    }
    return throwError(() => ({ status: 0, message: 'Erreur inattendue.' }) satisfies ApiError);
  }
}
