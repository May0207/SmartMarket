import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000'; // Ajusta si es diferente

  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get(`${this.apiUrl}/usuarios`);
  }

  updateUserRole(id: number, rol: string) {
    return this.http.put(`${this.apiUrl}/usuarios/${id}/rol`, { rol });
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
  }
}
