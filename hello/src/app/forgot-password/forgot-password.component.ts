import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/@kristujayanti\.com$/i)]]
    });
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast.message = message;
    this.toast.type = type;
    this.toast.visible = true;
    setTimeout(() => (this.toast.visible = false), 3000);
  }

  sendResetLink() {
  this.submitted = true;

  if (this.forgotForm.invalid) {
    this.showToast('Please enter a valid Kristu Jayanti email', 'error');
    return;
  }

  const email = this.forgotForm.value.email;
  this.isLoading = true;

 this.http.post('http://localhost:8888/api/auth/forgot-password', { email }, { responseType: 'text' }).subscribe({
    next: (res) => {
      console.log('✅ Success Response:', res); // <-- Log success
      this.showToast('Reset link sent to your email. Check your inbox!', 'success');
      this.step = 2;
      this.submitted = false;
    },
    error: (err: HttpErrorResponse) => {
      console.error('❌ Full Error Response:', err); // <-- Log full error object
      const errorMsg = err.error?.message || 'Failed to send reset link';
      this.showToast(`Error: ${errorMsg}`, 'error');
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}


  goToReset() {
    this.showToast('Check your email and click the reset link', 'success');
  }
}