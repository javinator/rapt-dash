import { Component, inject, OnInit, signal } from '@angular/core';
import { AlertComponent, SpinnerComponent } from '@components';
import { Message, ProfileSession } from '@models';
import { RaptApiService } from '@services';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'history',
  templateUrl: './history.page.html',
  styleUrl: './history.page.scss',
  imports: [SpinnerComponent, MatIconModule],
})
export class HistoryPage implements OnInit {
  private readonly apiService = inject(RaptApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = signal(true);
  sessions = signal<ProfileSession[]>([]);
  hydrometerId = signal('');

  ngOnInit() {
    this.hydrometerId.set(this.route.snapshot.queryParams['hydrometerId']);
    this.initializeData();
  }

  initializeData() {
    if (!this.apiService.isTokenValid()) {
      this.snackBar.openFromComponent(AlertComponent, {
        data: { type: 'info', text: 'Login Token expired!' } as Message,
      });
      void this.router.navigate(['/']);
      return;
    }
    firstValueFrom(this.apiService.getSessions(this.hydrometerId())).then(
      (sessions) => {
        console.debug('Sessions loaded!');
        this.sessions.set(sessions);
        this.loading.set(false);
      },
    );
  }

  navigateBack() {
    void this.router.navigate(['/dash']);
  }
}
