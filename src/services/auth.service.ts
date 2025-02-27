import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  register(email: string, password: string, birthdate: string) {
    return this.http.post(`${this.apiUrl}/register`, { email, password, birthdate }).toPromise();
  }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).toPromise();
  }
}
