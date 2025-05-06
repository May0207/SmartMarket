import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api'; // Asegúrate que coincide con tu backend

  constructor(private http: HttpClient) {}

  getProductos(limit = 25, offset = 0, filtros: any = {}): Observable<any[]> {
    let query = `${this.apiUrl}/productos?limit=${limit}&offset=${offset}`;
  
    if (filtros.precioMax) query += `&precioMax=${filtros.precioMax}`;
  
    if (filtros.supermercados) {
      filtros.supermercados.forEach((s: string) => {
        query += `&super=${encodeURIComponent(s)}`;
      });
    }
    if (filtros.search) {
      query += `&search=${encodeURIComponent(filtros.search)}`;
    }
    if (filtros.nutritionField && filtros.nutritionOrder) {
      query += `&nutritionField=${filtros.nutritionField}&nutritionOrder=${filtros.nutritionOrder}`;
    }
    
    return this.http.get<any[]>(query);
  }
  
}
