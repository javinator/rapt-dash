import {
  Component,
  input,
  OnInit,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ProfileSession } from '@models';

@Component({
  selector: 'rd-session-form',
  templateUrl: './session-form.component.html',
  styleUrl: './session-form.component.scss',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class SessionFormComponent implements OnInit {
  session = input<ProfileSession>();
  form = output<any>();

  submitForm(f: NgForm) {
    if (f.valid) {
      this.form.emit(f.value);
    }
  }

  ngOnInit() {
    if (this.session() && !this.session()?.start) {
      this.session()!.start = new Date().toISOString();
    }
  }
}
