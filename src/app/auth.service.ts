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

  private currentUser: { email: string; role: 'student' | 'admin'; name: string } | null = null;

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  // ✅ Load user from localStorage when app starts
  private loadUserFromStorage() {
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole') as 'student' | 'admin' | null;
    const name = localStorage.getItem('userName');

    if (email && role && name) {
      this.currentUser = { email, role, name };
      this.userRole = role;
    }
  }

  // ✅ Save user data
  private setUser(email: string, role: 'student' | 'admin', name: string) {
    this.currentUser = { email, role, name };
    this.userRole = role;

    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name);
  }

  // ✅ Clear user on logout
  private clearUser() {
    this.currentUser = null;
    this.userRole = null;

    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  }

  // ✅ Login API call
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem('authToken', res.token);
        localStorage.setItem('userRole', res.role);
        this.setUser(email, res.role, 'User'); // Replace 'User' with real name from backend if needed
      })
    );
  }

  // ✅ Logout
  logout(): void {
    this.clearUser();
  }

  // ✅ Get current user object
  getUser() {
    return this.currentUser;
  }

  // ✅ Get user role
  getRole(): 'student' | 'admin' | null {
    return this.currentUser?.role || null;
  }

  // ✅ Check if user is logged in
  isAuthenticated(): boolean {
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');

    if (email && role && name) {
      this.currentUser = { email, role: role as 'student' | 'admin', name };
      this.userRole = role as 'student' | 'admin';
      return true;
    }

    return false;
  }

  // ✅ Check if user is admin
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}
