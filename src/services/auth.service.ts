import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  register(nombre: string, apellido1: string, apellido2: string, email: string, password: string, birthdate: string) {
    return this.http.post(`${this.apiUrl}/register`, {
      nombre,
      apellido1,
      apellido2,
      email,
      password,
      birthdate
    }).toPromise();
  }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).toPromise();
  }
}
