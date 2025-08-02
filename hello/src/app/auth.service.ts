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

  private loadUserFromStorage() {
    const email = localStorage.getItem('userEmail');
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

    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name);
  }

  private clearUser() {
    this.currentUser = null;
    this.userRole = null;

    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem('authToken', res.token);
        localStorage.setItem('userRole', res.role);
        this.setUser(email, res.role, 'User'); // Replace with real name after /me call if needed
      })
    );
  }

  // ✅ NEW: Fetch user profile from backend (/api/me)
  getProfile(): Observable<{ email: string; role: 'student' | 'admin'; name: string }> {
    return this.http.get<{ email: string; role: 'student' | 'admin'; name: string }>(
      'http://localhost:8888/api/me'
    ).pipe(
      tap((user) => {
        this.setUser(user.email, user.role, user.name);
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

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}
