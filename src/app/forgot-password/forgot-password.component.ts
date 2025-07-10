import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  submitted = false;
  step = 1;
  fakeOtp = '123456';

  constructor(private fb: FormBuilder) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  sendOtp() {
    this.submitted = true;
    if (this.forgotForm.controls['email'].valid) {
      console.log(`OTP sent to ${this.forgotForm.value.email}`);
      this.step = 2;
      this.submitted = false;
    }
  }

  verifyOtp() {
    this.submitted = true;
    if (
      this.forgotForm.controls['otp'].valid &&
      this.forgotForm.value.otp === this.fakeOtp
    ) {
      console.log('OTP Verified');
      this.step = 3;
      this.submitted = false;
    }
  }

  onSubmit() {
    this.submitted = true;
    const { password, confirmPassword } = this.forgotForm.value;
    if (this.forgotForm.valid && password === confirmPassword) {
      alert('✅ Password has been reset!');
      console.log('New password:', password);
    }
  }
}
