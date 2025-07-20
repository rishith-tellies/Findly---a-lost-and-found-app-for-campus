import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  isLoading = true;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<{ email: string; role: string; name: string }>('http://localhost:8888/api/me', { headers })
      .subscribe({
        next: (user) => {
          this.name = user.name;
          this.email = user.email;
          this.role = user.role;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load profile';
          this.isLoading = false;
          console.error(err);
        }
      });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goBack() {
    this.location.back();
  }
}
