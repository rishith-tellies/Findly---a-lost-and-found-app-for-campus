import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  submitted = false;
  isLoading = false;
  step = 1;

  toast = {
    message: '',
    type: 'success' as 'success' | 'error',
    visible: false
  };

  constructor(private fb: FormBuilder, private router: Router) {
    this.forgotForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/@kristujayanti\.com$/i)
      ]]
    });
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast.message = message;
    this.toast.type = type;
    this.toast.visible = true;
    setTimeout(() => (this.toast.visible = false), 3000);
  }

  // ✅ NO API — simulate reset
  sendResetLink() {
    this.submitted = true;

    if (this.forgotForm.invalid) {
      this.showToast('Please enter a valid Kristu Jayanti email', 'error');
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      this.showToast('Reset link sent (simulated) 📩', 'success');
      this.step = 2;
      this.submitted = false;
      this.isLoading = false;
    }, 1000);
  }

  goToReset() {
    this.showToast('Check your email (simulated)', 'success');
  }
}