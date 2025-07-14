import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  role: 'student' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://172.21.11.35:8888/api/auth';
  private userRole: 'student' | 'admin' | null = null;

  private currentUser: { email: string; role: 'student' | 'admin'; name: string } | null = null;

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  // ✅ Load user from localStorage on app start
  private loadUserFromStorage() {
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('userRole') as 'student' | 'admin' | null;
    const name = localStorage.getItem('userName');

    if (email && role && name) {
      this.currentUser = { email, role, name };
      this.userRole = role;
    }
  }

  private setUser(email: string, role: 'student' | 'admin', name: string) {
    this.currentUser = { email, role, name };
    this.userRole = role;

    localStorage.setItem('email', email);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name);
  }

  private clearUser() {
    this.currentUser = null;
    this.userRole = null;

    localStorage.removeItem('email');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  // ✅ Call backend to login
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        this.userRole = res.role;
        // For now, set dummy user info — later replace with real values
        this.setUser(email, res.role, 'User');
      })
    );
  }

  logout(): void {
    this.clearUser();
  }

  getUser() {
    return this.currentUser;
  }

  getRole(): 'student' | 'admin' | null {
    return this.currentUser?.role || null;
  }

  isAuthenticated(): boolean {
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');

    if (email && role && name) {
      this.currentUser = { email, role: role as 'student' | 'admin', name };
      this.userRole = role as 'student' | 'admin';
      return true;
    }

    return false;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}
