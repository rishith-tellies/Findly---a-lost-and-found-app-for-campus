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
  isAnimating = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize reactive form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getter for email control
  get email() {
    return this.loginForm.get('email');
  }

  // Getter for password control
  get password() {
    return this.loginForm.get('password');
  }

  // Login function with animation and routing
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // show all errors
      return;
    }

    const { email, password } = this.loginForm.value;

    const loginSuccess = this.authService.login(email, password);

    if (loginSuccess) {
      this.isAnimating = true;

      // Delay navigation to allow animation to finish
      setTimeout(() => {
        const role = this.authService.getRole();

        if (role === 'admin') {
          this.router.navigate(['/dashboard/found']);
        } else {
          this.router.navigate(['/dashboard/lost']);
        }
      }, 500); // match with .animate-fade-out-down duration
    } else {
      alert('❌ Invalid email or password');
    }
  }

  onForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  onCreateAccount(): void {
    this.router.navigate(['/register']);
  }
}
