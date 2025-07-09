// src/app/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private role: 'student' | 'admin' | null = null;

  login(email: string, password: string): boolean {
    if (!email.endsWith('@kristujayanti.com')) return false;
    if (!password || password.trim() === '') return false;

    if (/^\d{2}admin@kristujayanti\.com$/.test(email)) {
      this.role = 'admin';
    } else if (/^\d{2}[a-z]{3}\d{2}@kristujayanti\.com$/.test(email)) {
      this.role = 'student';
    } else {
      return false;
    }

    return true;
  }

  getRole(): 'admin' | 'student' | null {
    return this.role;
  }

  logout(): void {
    this.role = null;
  }
}
