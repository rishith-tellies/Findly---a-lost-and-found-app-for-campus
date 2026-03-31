import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  resetForm: FormGroup;

  submitted = false;
  isLoading = false;

  toast = {
    message: '',
    type: 'success' as 'success' | 'error',
    visible: false
  };

  resetEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // ✅ Get email from localStorage (set in forgot-password)
    this.resetEmail = localStorage.getItem('resetEmail') || '';

    if (!this.resetEmail) {
      this.showToast('Invalid reset request. Please try again.', 'error');
      setTimeout(() => this.navigateToForgotPassword(), 2000);
    }
  }

  // 🔐 Password match validator
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

    if (!this.resetEmail) {
      this.showToast('Invalid reset request', 'error');
      return;
    }

    this.resetPassword();
  }

  // ✅ FRONTEND RESET LOGIC
  private resetPassword(): void {
    this.isLoading = true;

    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        const updatedUsers = users.map((user: any) => {
          if (user.email === this.resetEmail) {
            return {
              ...user,
              password: this.resetForm.value.password
            };
          }
          return user;
        });

        localStorage.setItem('users', JSON.stringify(updatedUsers));

        this.showToast('Password reset successfully! Redirecting...', 'success');

        // clear reset email
        localStorage.removeItem('resetEmail');

        setTimeout(() => this.navigateToLogin(), 2000);

      } catch (err) {
        console.error(err);
        this.showToast('Failed to reset password', 'error');
      }

      this.isLoading = false;
    }, 1000);
  }
}