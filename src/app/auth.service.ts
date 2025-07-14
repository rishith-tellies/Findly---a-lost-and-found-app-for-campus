import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  role: 'student' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUser: { email: string; role: 'student' | 'admin'; name: string } | null = null;

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('userRole') as 'student' | 'admin' | null;
    const name = localStorage.getItem('userName');

    if (email && role && name) {
      this.currentUser = { email, role, name };
    }
  }

  login(email: string, password: string): boolean {
    const lowerEmail = email.toLowerCase();
    const domain = '@kristujayanti.com';

    const isStudent = /^[0-9]{2}[a-z]{3,4}[0-9]{2}@kristujayanti\.com$/.test(lowerEmail);
    const isKristuEmail = lowerEmail.endsWith(domain);

    if (isStudent && password === 'student123') {
      this.setUser(lowerEmail, 'student', 'John Student');
      return true;
    }

    if (!isStudent && isKristuEmail && password === 'admin123') {
      this.setUser(lowerEmail, 'admin', 'Admin User');
      return true;
    }

    this.clearUser();
    return false;
  }

  private setUser(email: string, role: 'student' | 'admin', name: string) {
    this.currentUser = { email, role, name };
    localStorage.setItem('email', email);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name);
  }

  private clearUser() {
    this.currentUser = null;
    localStorage.removeItem('email');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');

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

    this.clearUser();
  }

  getRole(): 'student' | 'admin' | null {
    return this.currentUser?.role || null;
  }

  getUser() {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');

    if (email && role && name) {
      this.currentUser = { email, role: role as 'student' | 'admin', name };
      return true;
    }

    return false;
  }

  // ✅ NEW METHOD
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

    this.userRole = null;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

}
