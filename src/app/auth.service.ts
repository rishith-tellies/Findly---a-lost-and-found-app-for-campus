import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userRole: 'student' | 'admin' | null = null;

  login(email: string, password: string): boolean {
    const lowerEmail = email.toLowerCase();

    // Student regex: 2 digits + 2 to 4 letters + 2 digits + @kristujayanti.com
    const studentRegex = /^[0-9]{2}[a-z]{2,4}[0-9]{2}@kristujayanti\.com$/;

    // Admin regex remains same
    const adminRegex = /^[0-9]{2}admin@kristujayanti\.com$/;

    if (studentRegex.test(lowerEmail) && password === 'student123') {
      this.userRole = 'student';
      return true;
    }

    if (adminRegex.test(lowerEmail) && password === 'admin123') {
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
