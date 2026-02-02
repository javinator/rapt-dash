import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AlertComponent,
  DetailsComponent,
  SpinnerComponent,
} from '@components';
import { Message, ProfileSession, Telemetry } from '@models';
import { ApiService } from '@services';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
  imports: [SpinnerComponent, MatIconModule, DetailsComponent],
})
export class DashboardPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  loading = signal(true);
  session = signal<ProfileSession | undefined>(undefined);
  telemetry = signal<Telemetry[]>([]);

  ngOnInit() {
    this.initializeData();
  }

  initializeData() {
    if (!this.apiService.isAuthSet()) {
      this.snackBar.openFromComponent(AlertComponent, {
        data: { type: 'info', text: 'Login Token expired!' } as Message,
      });
      void this.router.navigate(['/']);
      return;
    }
    firstValueFrom(this.apiService.getLastSession()).then((session) => {
      console.debug('Session loaded!');
      this.session.set(session);
      this.apiService.getTelemetry(session.id).subscribe((tele) => {
        console.debug('Telemetry loaded!');
        this.telemetry.set(tele);
        this.loading.set(false);
      });
    });
  }

  reloadData() {
    this.loading.set(true);
    this.initializeData();
  }

  openHistory() {
    void this.router.navigate(['/history']);
  }

  logout() {
    this.apiService.logout();
    void this.router.navigate(['/']);
  }
}
