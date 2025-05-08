import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://localhost:3000/api/favoritos'; // ✅ URL base real

  constructor(private http: HttpClient) { }

  addFavorite(userId: number, product: any) {
    const body = {
      userId,
      productId: product.id
    };
    return this.http.post(`${this.apiUrl}/add`, body); // ✅ usa apiUrl correctamente
  }

  getFavorites(userId: number) {
    return this.http.get<any[]>(`http://localhost:3000/api/favoritos/${userId}`);
  }

  removeFavorite(userId: number, productId: number) {
    return this.http.delete(`http://localhost:3000/api/favoritos/${userId}/${productId}`);
  }  
   
}
