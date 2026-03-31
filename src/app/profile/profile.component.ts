import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  email: string = '';
  role: string = '';
  name: string = '';

  isLoading = true;
  errorMessage = '';

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const userRole = localStorage.getItem('userRole');
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      if (!userEmail) {
        this.router.navigate(['/login']);
        return;
      }

      const user = users.find((u: any) => u.email === userEmail);

      if (user) {
        this.name = user.name || 'User';
        this.email = user.email;
        this.role = userRole || 'user';
      } else {
        this.errorMessage = 'User not found';
      }

      this.isLoading = false;

    } catch (err) {
      console.error(err);
      this.errorMessage = 'Failed to load profile';
      this.isLoading = false;
    }
  }

  // 🔐 Logout
  logout(): void {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');

    this.router.navigate(['/login']);
  }

  // 🔙 Go Back
  goBack(): void {
    this.location.back();
  }
}