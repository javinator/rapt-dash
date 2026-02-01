import { Component, inject, OnInit, signal } from '@angular/core';
import { AlertComponent, SpinnerComponent } from '@components';
import { Message, ProfileSession } from '@models';
import { ApiService } from '@services';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'history',
  templateUrl: './history.page.html',
  styleUrl: './history.page.scss',
  imports: [SpinnerComponent, MatIconModule, DatePipe],
})
export class HistoryPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  loading = signal(true);
  sessions = signal<ProfileSession[]>([]);

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
      this.sessions.set(sessions.filter((session) => session.end));
      this.loading.set(false);
    });
  }

  navigateBack() {
    void this.router.navigate(['/dash']);
  }
}
