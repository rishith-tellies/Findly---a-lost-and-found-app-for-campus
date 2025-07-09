import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onLogin(): void {
    const { email, password } = this.loginForm.value;

    const loginSuccess = this.authService.login(email, password);

    if (loginSuccess) {
      const role = this.authService.getRole();
      if (role === 'admin') {
        this.router.navigate(['/dashboard/found']);
      } else {
        this.router.navigate(['/dashboard/lost']);
      }
    } else {
      alert('❌ Invalid email or password!');
    }
  }

  onForgotPassword(): void {
    alert('📧 Password reset link would be sent to your email (not implemented).');
  }
}
