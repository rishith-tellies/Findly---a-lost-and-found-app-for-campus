import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userRole: 'student' | 'admin' | null = null;

  private currentUser: { email: string; role: 'student' | 'admin'; name: string } | null = null;

  constructor() {
    this.initializeDefaultUsers(); // 🔥 add default users
    this.loadUserFromStorage();
  }

  // 🔥 DEFAULT USERS (AUTO CREATE)
  private initializeDefaultUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const adminExists = users.find((u: any) => u.email === 'admin@findly.com');
    const userExists = users.find((u: any) => u.email === 'user@findly.com');

    if (!adminExists) {
      users.push({
        name: 'Admin User',
        email: 'admin@findly.com',
        password: '123456',
        role: 'admin'
      });
    }

    if (!userExists) {
      users.push({
        name: 'Test User',
        email: 'user@findly.com',
        password: '123456',
        role: 'student'
      });
    }

    localStorage.setItem('users', JSON.stringify(users));
  }

  // 🔄 LOAD USER FROM STORAGE
  private loadUserFromStorage() {
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole') as 'student' | 'admin' | null;
    const name = localStorage.getItem('userName');

    if (email && role && name) {
      this.currentUser = { email, role, name };
      this.userRole = role;
    }
  }

  // 🧠 SET USER SESSION
  private setUser(email: string, role: 'student' | 'admin', name: string) {
    this.currentUser = { email, role, name };
    this.userRole = role;

    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name);
  }

  // ❌ CLEAR USER SESSION
  private clearUser() {
    this.currentUser = null;
    this.userRole = null;

    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  }

  // ✅ LOGIN (FRONTEND)
  login(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!user) return false;

    const role = user.role || 'student';

    this.setUser(email, role, user.name || 'User');

    return true;
  }

  // ✅ REGISTER
  register(user: { email: string; password: string; name: string; role?: 'student' | 'admin' }) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const exists = users.find((u: any) => u.email === user.email);
    if (exists) return false;

    const newUser = {
      ...user,
      role: user.role || 'student'
    };

    users.push(newUser);

    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  // 🚪 LOGOUT
  logout(): void {
    this.clearUser();
  }

  // 👤 GET USER
  getUser() {
    return this.currentUser;
  }

  // 🛡 GET ROLE
  getRole(): 'student' | 'admin' | null {
    return this.currentUser?.role || null;
  }

  // 🔐 CHECK LOGIN
  isAuthenticated(): boolean {
    return !!localStorage.getItem('userEmail');
  }

  // 👑 ADMIN CHECK
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}