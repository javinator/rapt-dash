import { Component, inject, signal } from '@angular/core';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '@components';
import { Message } from '@models';

@Component({
  selector: 'rd-confirmation-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrl: './share-dialog.component.scss',
  imports: [MatDialogModule, ClipboardModule, MatIcon],
  standalone: true,
})
export class ShareDialogComponent {
  readonly data = inject<{ session: string; share: string }>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ShareDialogComponent>);
  readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  share = signal(this.data.share || '');

  confirm(c: boolean) {
    if (c) {
      this.dialogRef.close(this.share());
    } else {
      this.dialogRef.close();
    }
  }

  generate() {
    this.share.set(uuidv4());
  }

  delete() {
    this.share.set('');
  }

  copy() {
    this.clipboard.copy('https://rapt.bier-freunde.ch/' + this.share());
    this.snackBar.openFromComponent(AlertComponent, {
      data: { type: 'info', text: 'Link copied to clipboard' } as Message,
    });
  }
}
