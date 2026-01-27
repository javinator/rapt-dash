import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Message } from '@models';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'rd-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  imports: [MatIconModule],
})
export class AlertComponent {
  message: Message = inject(MAT_SNACK_BAR_DATA);
}
