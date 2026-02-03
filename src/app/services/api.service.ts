import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, Observable, of } from 'rxjs';
import { Message, ProfileSession, Telemetry } from '@models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '@components';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cookieService = inject(CookieService);

  isAuthSet() {
    return this.cookieService.check('basic-auth');
  }

  logout() {
    this.cookieService.delete('basic-auth');
    this.snackBar.openFromComponent(AlertComponent, {
      data: { type: 'success', text: 'Logout successful!' } as Message,
    });
  }

  async login(email: string, password: string) {
    try {
      const success = await firstValueFrom(
        this.http.get<boolean>('https://bier-freunde.ch/rest/rapt/api.php', {
          headers: {
            Authorization: 'Basic ' + btoa(email + ':' + password),
          },
        }),
      );
      if (success) {
        this.snackBar.openFromComponent(AlertComponent, {
          data: { type: 'success', text: 'Login successful!' } as Message,
        });
        this.cookieService.set('basic-auth', btoa(email + ':' + password));
      }
      return success;
    } catch (e) {
      this.snackBar.openFromComponent(AlertComponent, {
        data: { type: 'error', text: 'Login failed!' } as Message,
      });
      console.warn(e);
      return false;
    }
  }

  getLastSession(): Observable<ProfileSession> {
    return this.http
      .get<ProfileSession>(
        'https://bier-freunde.ch/rest/rapt/api.php/session',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + this.cookieService.get('basic-auth'),
          },
        },
      )
      .pipe(
        catchError((err) => {
          this.snackBar.openFromComponent(AlertComponent, {
            data: {
              type: 'error',
              text: 'Error fetching session!',
            } as Message,
          });
          console.warn(err);
          return of();
        }),
      );
  }

  getSessions(): Observable<ProfileSession[]> {
    return this.http
      .get<ProfileSession[]>(
        'https://bier-freunde.ch/rest/rapt/api.php/session/history',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + this.cookieService.get('basic-auth'),
          },
        },
      )
      .pipe(
        catchError((err) => {
          this.snackBar.openFromComponent(AlertComponent, {
            data: {
              type: 'error',
              text: 'Error fetching sessions!',
            } as Message,
          });
          console.warn(err);
          return of([]);
        }),
      );
  }

  getTelemetry(sessionId: string): Observable<Telemetry[]> {
    return this.http
      .get<Telemetry[]>(
        'https://bier-freunde.ch/rest/rapt/api.php/telemetry/' + sessionId,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + this.cookieService.get('basic-auth'),
          },
        },
      )
      .pipe(
        catchError((err) => {
          this.snackBar.openFromComponent(AlertComponent, {
            data: {
              type: 'error',
              text: 'Error fetching telemetry!',
            } as Message,
          });
          console.warn(err);
          return of([]);
        }),
      );
  }

  createSession(session: ProfileSession) {
    return this.http
      .post<Telemetry[]>(
        'https://bier-freunde.ch/rest/rapt/api.php/session',
        session,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + this.cookieService.get('basic-auth'),
          },
        },
      )
      .pipe(
        catchError((err) => {
          this.snackBar.openFromComponent(AlertComponent, {
            data: {
              type: 'error',
              text: 'Error saving session!',
            } as Message,
          });
          console.warn(err);
          return of([]);
        }),
      );
  }

  deleteSession(id: string) {
    return this.http
      .delete<Telemetry[]>(
        'https://bier-freunde.ch/rest/rapt/api.php/session/' + id,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + this.cookieService.get('basic-auth'),
          },
        },
      )
      .pipe(
        catchError((err) => {
          this.snackBar.openFromComponent(AlertComponent, {
            data: {
              type: 'error',
              text: 'Error deleting session!',
            } as Message,
          });
          console.warn(err);
          return of([]);
        }),
      );
  }
}
