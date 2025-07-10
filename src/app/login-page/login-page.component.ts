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
    // ✅ Initialize the login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // ✅ Form control getter for email
  get email() {
    return this.loginForm.get('email');
  }

  // ✅ Form control getter for password
  get password() {
    return this.loginForm.get('password');
  }


  // ✅ Handle form submission

  // ✅ Handle Login

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Show errors
      return;
    }


    const { email, password } = this.loginForm.value;

    const loginSuccess = this.authService.login(email, password);

    if (loginSuccess) {
      const role = this.authService.getRole();

      // ✅ Navigate based on user role
      if (role === 'admin') {
        this.router.navigate(['/dashboard/found']);
      } else {
        this.router.navigate(['/dashboard/lost']);
      }

    const email = this.email?.value;
    const password = this.password?.value;

    const success = this.authService.login(email, password);
    if (success) {
      const role = this.authService.getRole();
      this.router.navigate([role === 'admin' ? '/dashboard/found' : '/dashboard/lost']);

    } else {
      alert('❌ Invalid email or password');
    }
  }

  // ✅ Navigate to Forgot Password
  onForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  // ✅ Navigate to Create Account
  onCreateAccount(): void {
    this.router.navigate(['/register']);
  }
}
