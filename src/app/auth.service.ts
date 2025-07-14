import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  role: 'student' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8888/api/auth';
  private userRole: 'student' | 'admin' | null = null;

  constructor(private http: HttpClient) {
    const storedRole = localStorage.getItem('role') as 'student' | 'admin' | null;
    this.userRole = storedRole;
  }

  // ✅ Call backend to login
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        // Store token and role
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        this.userRole = res.role;
      })
    );
  }

  // ✅ Get role
  getRole(): 'student' | 'admin' | null {
    return this.userRole;
  }

  // ✅ Check if token exists
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ Logout
  logout(): void {
    this.userRole = null;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}
