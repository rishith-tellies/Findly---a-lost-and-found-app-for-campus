import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  formData = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  toast = {
    message: '',
    type: 'success' as 'success' | 'error',
    visible: false
  };

  constructor(private router: Router, private http: HttpClient) {}

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast.message = message;
    this.toast.type = type;
    this.toast.visible = true;

    setTimeout(() => {
      this.toast.visible = false;
    }, 2000);
  }

  onRegister(): void {
    const { fullName, email, password, confirmPassword } = this.formData;

    if (password !== confirmPassword) {
      this.showToast('❌ Passwords do not match!', 'error');
      return;
    }

    const payload = {
      name: fullName,
      email: email,
      password: password
    };

    this.http.post('http://localhost:8888/api/auth/register', payload, {
      observe: 'response',
      responseType: 'text'
    }).subscribe({
      next: (res: HttpResponse<any>) => {
        if (res.status === 200 || res.status === 201) {
          this.showToast('✅ Registered successfully!', 'success');
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.showToast(`⚠️ Unexpected response: ${res.status}`, 'error');
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.showToast('❌ Email already registered.', 'error');
        } else if (error.status === 0) {
          this.showToast('❌ Cannot connect to server.', 'error');
        } else if (typeof error.error === 'string') {
          this.showToast('❌ ' + error.error, 'error');
        } else if (error.error?.message) {
          this.showToast('❌ ' + error.error.message, 'error');
        } else if (error.message) {
          this.showToast('❌ ' + error.message, 'error');
        } else {
          this.showToast('❌ Registration failed.', 'error');
        }
      }
    });
  }
}
