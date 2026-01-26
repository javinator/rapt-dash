import { Component, inject, OnInit, signal } from '@angular/core';
import { Spinner, Login, AlertComponent } from '@components';
import { RaptApiService } from '@services';

@Component({
  selector: 'app-root',
  imports: [Spinner, Login, AlertComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly apiService = inject(RaptApiService);
  loading = signal(true);
  authenticated = signal(false);

  ngOnInit() {
    setTimeout(() => this.loading.set(false), 500);
  }

  protected login(username: string, apiToken: string) {
    this.loading.set(true);
    console.log(username + ':' + apiToken);
    this.apiService.getBearerToken(username, apiToken).then((success) => {
      this.authenticated.set(success);
      this.loading.set(false);
    });
  }
}
