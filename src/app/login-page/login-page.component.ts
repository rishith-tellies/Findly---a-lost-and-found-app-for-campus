import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  loginForm: FormGroup;
  isAnimating = false;

  toast = {
    message: '',
    type: 'success' as 'success' | 'error',
    visible: false
  };

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

  showToast(message: string, type: 'success' | 'error') {
    this.toast.message = message;
    this.toast.type = type;
    this.toast.visible = true;
    setTimeout(() => (this.toast.visible = false), 3000);
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.showToast('✅ Login successful!', 'success');
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);

        this.isAnimating = true;

        setTimeout(() => {
          const role = res.role;
          if (role === 'admin') {
            this.router.navigate(['/dashboard/found']);
          } else {
            this.router.navigate(['/dashboard/lost']);
          }
        }, 600);
      },
      error: (err: HttpErrorResponse) => {
        let errorMsg = '❌ Login failed. Please try again.';

        if (err.status === 0) {
          errorMsg = '❌ Server unreachable.';
        } else if (err.status === 401) {
          errorMsg = '❌ Invalid email or password.';
        } else if (typeof err.error === 'string') {
          errorMsg = '❌ ' + err.error;
        } else if (err.error?.message) {
          errorMsg = '❌ ' + err.error.message;
        }

        this.showToast(errorMsg, 'error');
      }
    });
  }

  onForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  onCreateAccount(): void {
    this.router.navigate(['/register']);
  }
}
