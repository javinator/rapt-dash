import { Component, inject, OnInit, signal } from '@angular/core';
import { LoginComponent, SpinnerComponent } from '@components';
import { ApiService } from '@services';
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
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  ngOnInit() {
    setTimeout(() => this.loading.set(false), 500);
  }

  protected login(username: string, apiToken: string) {
    this.loading.set(true);
    this.apiService.login(username, apiToken).then((success) => {
      if (success) {
        void this.router.navigate(['/dash']);
      }
      this.loading.set(false);
    });
  }
}
