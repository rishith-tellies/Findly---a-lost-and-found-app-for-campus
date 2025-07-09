import { Component } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  showForm = false;

  formData = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  onGetStarted(): void {
    this.showForm = true;
  }

  onRegister(): void {
    if (this.formData.password !== this.formData.confirmPassword) {
      alert('❌ Passwords do not match!');
      return;
    }
    console.log('✅ Registered Data:', this.formData);
    alert('🎉 Registration Successful!');
  }
}
