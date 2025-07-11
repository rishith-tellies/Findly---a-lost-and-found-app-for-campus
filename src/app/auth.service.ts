import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: { email: string; role: 'student' | 'admin'; name: string } | null = null;

  constructor() {
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
      this.setUser(lowerEmail, 'student', 'John Student'); // 🔁 Use actual name if you have it
      return true;
    }

    if (!isStudent && isKristuEmail && password === 'admin123') {
      this.setUser(lowerEmail, 'admin', 'Admin User'); // 🔁 Change name accordingly
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
  }

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
    return !!this.currentUser;
  }
}
