import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'rd-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class SpinnerComponent {}
