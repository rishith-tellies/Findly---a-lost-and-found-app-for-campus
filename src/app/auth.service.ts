import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userRole: 'student' | 'admin' | null = null;

  login(email: string, password: string): boolean {
    const lowerEmail = email.toLowerCase();
    const domain = '@kristujayanti.com';

    const isStudent = /^[0-9]{2}[a-z]{3,4}[0-9]{2}@kristujayanti\.com$/.test(lowerEmail);
    const isKristuEmail = lowerEmail.endsWith(domain);

    if (isStudent && password === 'student123') {
      this.userRole = 'student';
      return true;
    }

    if (!isStudent && isKristuEmail && password === 'admin123') {
      this.userRole = 'admin';
      return true;
    }

    this.userRole = null;
    return false;
  }

  getRole(): 'student' | 'admin' | null {
    return this.userRole;
  }

  logout(): void {
    this.userRole = null;
  }
}
