import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUser: any = null;

  constructor(private http: HttpClient) {}

  async register(
    nombre: string,
    apellido1: string,
    apellido2: string,
    email: string,
    password: string,
    birthdate: string
  ) {
    return this.http
      .post(`${this.apiUrl}/register`, {
        nombre,
        apellido1,
        apellido2,
        email,
        password,
        birthdate,
      })
      .toPromise();
  }

  async login(email: string, password: string) {
    const response: any = await this.http
      .post(`${this.apiUrl}/login`, { email, password })
      .toPromise();

    if (response && response.user) {
      this.currentUser = response.user;
      localStorage.setItem('user', JSON.stringify(this.currentUser));
    }

    return response;
  }

  getCurrentUser() {
    if (!this.currentUser) {
      const userStr = localStorage.getItem('user');
      this.currentUser = userStr ? JSON.parse(userStr) : null;
    }
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.rol || null;
  }
}
