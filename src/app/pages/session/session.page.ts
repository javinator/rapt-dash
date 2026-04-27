import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AlertComponent,
  ConfirmationDialogComponent,
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
import { MatDialog } from '@angular/material/dialog';
import { DateUtil } from '@utils';
import { ShareDialogComponent } from '../../components/share-dialog/share-dialog.component';

@Component({
  selector: 'session',
  templateUrl: './session.page.html',
  styleUrl: './session.page.scss',
  imports: [SpinnerComponent, MatIconModule, DatePipe, SessionFormComponent],
  standalone: true,
})
export class SessionPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  readonly dialog = inject(MatDialog);

  protected readonly parseInt = parseInt;
  protected readonly DateUtil = DateUtil;

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
      setTimeout(() => this.loading.set(false), 250);
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

  saveSession(sessionDto: any) {
    this.loading.set(true);
    let session: ProfileSession = {
      id: sessionDto.id,
      name: sessionDto.name,
      start: sessionDto.startDate + ' ' + sessionDto.startTime,
      end: sessionDto.endTime
        ? sessionDto.endDate + ' ' + sessionDto.endTime
        : undefined,
    };

    firstValueFrom(this.apiService.createSession(session)).then(() => {
      this.snackBar.openFromComponent(AlertComponent, {
        data: {
          type: 'success',
          text: 'Session successfully saved!',
        } as Message,
      });
      this.initializeData();
      this.detailSession.set(undefined);
    });
  }

  deleteSession() {
    this.dialog
      .open(ConfirmationDialogComponent, {
        width: '400px',
        data: {
          title: 'Delete Session?',
          description:
            "Do you really want to delete session '" +
            this.detailSession()?.name +
            "'?",
        },
      })
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          firstValueFrom(
            this.apiService.deleteSession(this.detailSession()!.id),
          ).then(() => {
            this.snackBar.openFromComponent(AlertComponent, {
              data: {
                type: 'success',
                text: 'Session successfully deleted!',
              } as Message,
            });
            this.initializeData();
            this.detailSession.set(undefined);
          });
        }
      });
  }

  shareSession() {
    this.dialog
      .open(ShareDialogComponent, {
        width: '99%',
        maxWidth: '1200px',
        data: {
          session: this.detailSession()?.name,
          share: this.detailSession()?.share,
        },
      })
      .afterClosed()
      .subscribe((result: string) => {
        this.loading.set(true);
        if (result === undefined || result === null) {
          this.loading.set(false);
        } else if (result.length === 0) {
          firstValueFrom(
            this.apiService.deleteSharedLink(this.detailSession()!.id),
          )
            .then(() => {
              console.log('Share deleted');
              this.detailSession()!.share = undefined;
              this.snackBar.openFromComponent(AlertComponent, {
                data: {
                  type: 'success',
                  text: 'Share successfully deleted!',
                } as Message,
              });
              setTimeout(() => this.loading.set(false), 200);
            })
            .catch(() => {
              setTimeout(() => this.loading.set(false), 500);
            });
        } else {
          firstValueFrom(
            this.apiService.setSharedLink(this.detailSession()!.id, result),
          )
            .then((result) => {
              console.log('New share uuid: ' + result.share);
              this.detailSession()!.share = result.share;
              this.snackBar.openFromComponent(AlertComponent, {
                data: {
                  type: 'success',
                  text: 'Share successfully saved!',
                } as Message,
              });
              setTimeout(() => this.loading.set(false), 200);
            })
            .catch(() => {
              setTimeout(() => this.loading.set(false), 500);
            });
        }
      });
  }
}
