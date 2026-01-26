import { Component, output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'rd-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  imports: [FormsModule],
})
export class Login {
  formLogin = output<{ username: string; apiToken: string }>();

  submitForm(f: NgForm) {
    if (f.valid) {
      this.formLogin.emit(f.value);
    }
  }
}
