import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, firstValueFrom, Observable, of } from 'rxjs';
import { Hydrometer, Message, ProfileSession, Telemetry } from '@models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '@components';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class RaptApiService {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cookieService = inject(CookieService);

  isTokenValid() {
    return this.cookieService.check('bearerToken');
  }

  async getBearerToken(username: string, apiToken: string) {
    const body = new HttpParams()
      .set('client_id', 'rapt-user')
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', apiToken);
    try {
      const token: any = await firstValueFrom(
        this.http.post('https://id.rapt.io/connect/token', body.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );
      console.log(token);
      if (token.access_token) {
        let expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + 3600000);
        this.cookieService.set('bearerToken', token.access_token, expiryDate);
        this.snackBar.openFromComponent(AlertComponent, {
          data: { type: 'success', text: 'Login successful!' } as Message,
        });
      }
      return !!token.access_token;
    } catch (e) {
      this.snackBar.openFromComponent(AlertComponent, {
        data: { type: 'error', text: 'Login failed!' } as Message,
      });
      console.warn(e);
      return false;
    }
  }

  getHydrometers(): Observable<Hydrometer[]> {
    const token = this.cookieService.get('bearerToken');
    return this.http
      .get<Hydrometer[]>('https://api.rapt.io/api/Hydrometers/GetHydrometers', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
      .pipe(
        catchError((err) => {
          this.snackBar.openFromComponent(AlertComponent, {
            data: {
              type: 'error',
              text: 'Error fetching hydrometers!',
            } as Message,
          });
          console.warn(err);
          return of([]);
        }),
      );
  }

  getTelemetry(hydroId: string, sessionId: string): Observable<Telemetry[]> {
    const token = this.cookieService.get('bearerToken');
    return this.http
      .get<Telemetry[]>('https://api.rapt.io/api/Hydrometers/GetTelemetry', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        params: {
          hydrometerId: hydroId,
          profileSessionId: sessionId,
        },
      })
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

  getSessions(hydroId: string): Observable<ProfileSession[]> {
    const token = this.cookieService.get('bearerToken');
    return this.http
      .get<ProfileSession[]>(
        'https://api.rapt.io/api/ProfileSessions/GetHydrometerProfileSessions',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          params: {
            hydrometerId: hydroId,
            page: 1,
            pageSize: 5,
            filterText: '',
          },
        },
      )
      .pipe(
        catchError((err) => {
          this.snackBar.openFromComponent(AlertComponent, {
            data: {
              type: 'error',
              text: 'Error fetching profile sessions!',
            } as Message,
          });
          console.warn(err);
          return of([]);
        }),
      );
  }
}
