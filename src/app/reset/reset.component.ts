import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  submitted = false;
  isLoading = false;
  isValidToken = false;
  isTokenChecked = false;

  toast = {
    message: '',
    type: 'success' as 'success' | 'error',
    visible: false
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    public router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (this.token) {
        this.validateToken();
      } else {
        this.handleInvalidToken();
      }
    });
  }

  private validateToken(): void {
    this.isValidToken = true;
    this.isTokenChecked = true;
  }

  private handleInvalidToken(): void {
    this.showToast('Missing or invalid reset token', 'error');
    this.isTokenChecked = true;
    setTimeout(() => this.navigateToForgotPassword(), 3000);
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toast.message = message;
    this.toast.type = type;
    this.toast.visible = true;
    setTimeout(() => (this.toast.visible = false), 3000);
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.resetForm.invalid) {
      if (this.resetForm.hasError('mismatch')) {
        this.showToast('Passwords do not match', 'error');
      }
      return;
    }

    if (!this.token) {
      this.showToast('Invalid reset link', 'error');
      return;
    }

    this.resetPassword();
  }

  private resetPassword(): void {
    this.isLoading = true;

   this.http.post('http://localhost:8888/api/auth/reset-password', {
  token: this.token,
  newPassword: this.resetForm.value.password
}, { responseType: 'text' }).subscribe({
  next: (res) => {
    console.log('✅ Backend response:', res); // Will be: "Password reset successful"
    this.handleResetSuccess();
  },
  error: (err) => this.handleResetError(err),
  complete: () => this.handleResetComplete()
});

  }

  private handleResetSuccess(): void {
    this.showToast('Password reset successfully! Redirecting to login...', 'success');
    setTimeout(() => this.navigateToLogin(), 2000);
  }

  private handleResetError(err: any): void {
  console.error('❌ Full error from backend:', err); // 🔍 Log full error

  const errorMsg = err.error?.message || err.message || 'Failed to reset password';
  this.showToast(`Error: ${errorMsg}`, 'error');

  if (err.status === 400) {
    setTimeout(() => this.navigateToForgotPassword(), 3000);
  }
}

  private handleResetComplete(): void {
    this.isLoading = false;
  }
}