import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  email: string = '';
  role: string = '';
  name: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser?.();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.email = user.email;
    this.role = user.role;
    this.name = user.name;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goBack() {
    this.location.back(); // ✅ Navigates to the previous page
  }
}
