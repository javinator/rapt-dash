import { Component, output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'rd-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [FormsModule],
})
export class LoginComponent {
  formLogin = output<{ username: string; apiToken: string }>();

  submitForm(f: NgForm) {
    if (f.valid) {
      this.formLogin.emit(f.value);
    }
  }
}
