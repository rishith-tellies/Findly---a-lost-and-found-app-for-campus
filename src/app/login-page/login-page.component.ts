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

  onLogin() {
    const email = this.email?.value;
    const password = this.password?.value;

    const success = this.authService.login(email, password);
    if (success) {
      this.router.navigate(['/lost']); // Navigate to dashboard
    } else {
      alert('Invalid email or password');
    }
  }

  onForgotPassword(): void {
    alert('📧 A reset link will be sent to your Kristu Jayanti email address.');
  }

  onCreateAccount(): void {
    this.router.navigate(['/register']);
  }
}
