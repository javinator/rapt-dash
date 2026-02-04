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
import { DatePipe, DecimalPipe } from '@angular/common';
import { DateUtil } from '@utils';

@Component({
  selector: 'history',
  templateUrl: './history.page.html',
  styleUrl: './history.page.scss',
  imports: [
    SpinnerComponent,
    MatIconModule,
    DatePipe,
    DetailsComponent,
    DecimalPipe,
  ],
})
export class HistoryPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  loading = signal(true);
  sessions = signal<ProfileSession[]>([]);
  detailSession = signal<ProfileSession | undefined>(undefined);
  detailTelemetry = signal<Telemetry[]>([]);

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
    firstValueFrom(this.apiService.getSessions()).then((sessions) => {
      console.debug('Sessions loaded!');
      this.sessions.set(
        sessions.filter((session) => !DateUtil.isActive(session.end)),
      );
      this.loading.set(false);
    });
  }

  navigateBack() {
    if (this.detailSession()) {
      this.detailSession.set(undefined);
      this.detailTelemetry.set([]);
    } else {
      void this.router.navigate(['/dash']);
    }
  }

  loadHistory(id: string) {
    this.loading.set(true);
    this.detailSession.set(this.sessions().find((s) => s.id === id));
    firstValueFrom(this.apiService.getTelemetry(id)).then((telemetry) => {
      this.detailTelemetry.set(telemetry);
      setTimeout(() => this.loading.set(false), 100);
    });
  }
}
