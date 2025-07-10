import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  onRegister(): void {
    if (this.formData.password !== this.formData.confirmPassword) {
      alert('❌ Passwords do not match!');
      return;
    }

    alert('✅ Registration Successful!');
    this.router.navigate(['/login']);
  }
}
