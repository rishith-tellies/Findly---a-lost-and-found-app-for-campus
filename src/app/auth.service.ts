import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userRole: 'student' | 'admin' | null = null;

  constructor() {
    const storedRole = localStorage.getItem('userRole') as 'student' | 'admin' | null;
    this.userRole = storedRole;
  }

  login(email: string, password: string): boolean {
    const lowerEmail = email.toLowerCase();
    const domain = '@kristujayanti.com';

    const isStudent = /^[0-9]{2}[a-z]{3,4}[0-9]{2}@kristujayanti\.com$/.test(lowerEmail);
    const isKristuEmail = lowerEmail.endsWith(domain);

    if (isStudent && password === 'student123') {
      this.setRole('student');
      return true;
    }

    if (!isStudent && isKristuEmail && password === 'admin123') {
      this.setRole('admin');
      return true;
    }

    this.clearRole();
    return false;
  }

  getRole(): 'student' | 'admin' | null {
    return this.userRole;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('userRole');
  }

  logout(): void {
    this.clearRole();
  }

  private setRole(role: 'student' | 'admin') {
    this.userRole = role;
    localStorage.setItem('userRole', role);
  }

  private clearRole() {
    this.userRole = null;
    localStorage.removeItem('userRole');
  }
}
