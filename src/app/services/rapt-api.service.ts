import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class RaptApiService {
  private readonly http = inject(HttpClient);
  private readonly alertService = inject(AlertService);

  bearerToken = signal('');

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
        this.bearerToken.set(token.access_token);
        this.alertService.success('Login successful!');
      }
      return !!token.access_token;
    } catch (e) {
      this.alertService.error('Login failed!');
      console.warn(e);
      return false;
    }
  }
}
