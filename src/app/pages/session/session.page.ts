import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AlertComponent,
  SessionFormComponent,
  SpinnerComponent,
} from '@components';
import { Message, ProfileSession } from '@models';
import { ApiService } from '@services';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'session',
  templateUrl: './session.page.html',
  styleUrl: './session.page.scss',
  imports: [SpinnerComponent, MatIconModule, DatePipe, SessionFormComponent],
})
export class SessionPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  loading = signal(true);
  sessions = signal<ProfileSession[]>([]);
  detailSession = signal<ProfileSession | undefined>(undefined);

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
      this.sessions.set(sessions);
      this.loading.set(false);
    });
  }

  navigateBack() {
    if (this.detailSession()) {
      this.detailSession.set(undefined);
    } else {
      void this.router.navigate(['/dash']);
    }
  }

  editSession(id: string) {
    this.detailSession.set(this.sessions().find((s) => s.id === id));
  }

  createSession() {
    this.detailSession.set({ id: '-1', name: '' });
  }

  saveSession(session: any) {
    // TODO: implement save
    this.loading.set(true);
    console.log(session);
    this.snackBar.openFromComponent(AlertComponent, {
      data: { type: 'info', text: 'Save not yet implemented' } as Message,
    });
    setTimeout(() => {
      this.detailSession.set(undefined);
      this.loading.set(false);
    }, 250);
  }
}
