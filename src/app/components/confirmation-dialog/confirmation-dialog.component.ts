import { Component, inject } from '@angular/core';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'rd-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
  imports: [MatDialogModule],
})
export class ConfirmationDialogComponent {
  readonly data = inject<{ title: string; description: string }>(
    MAT_DIALOG_DATA,
  );
  readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);

  confirm(c: boolean) {
    this.dialogRef.close(c);
  }
}
