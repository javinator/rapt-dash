import { Component, inject, OnInit, signal } from '@angular/core';
import { LoginComponent, SpinnerComponent } from '@components';
import { RaptApiService } from '@services';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'home',
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  imports: [SpinnerComponent, MatIconModule, LoginComponent],
})
export class HomePage implements OnInit {
  loading = signal(true);
  authenticated = signal(false);
  private readonly apiService = inject(RaptApiService);
  private readonly router = inject(Router);

  ngOnInit() {
    this.authenticated.set(this.apiService.isTokenValid());
    if (this.authenticated()) {
      void this.router.navigate(['/dash']);
    }
    setTimeout(() => this.loading.set(false), 500);
  }

  protected login(username: string, apiToken: string) {
    this.loading.set(true);
    console.log(username + ':' + apiToken);
    this.apiService.getBearerToken(username, apiToken).then((success) => {
      this.authenticated.set(success);
      void this.router.navigate(['/dash']);
      this.loading.set(false);
    });
  }
}
