import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage {
  searchTerm: string = '';
  productosFiltrados: any[] = [];
  productosFavoritos: any[] = [];

  loading: boolean = true;

  popoverEvent: Event | null = null;
  isPopoverOpen: boolean = false;

  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ionViewWillEnter() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true; // ✅ activar estado de carga

    this.favoritesService.getFavorites(user.id_usuario).subscribe({
      next: (data) => {
        this.productosFavoritos = data;
        this.productosFiltrados = data;
        this.loading = false; // ✅ desactivar carga
      },
      error: (err) => {
        console.error('Error cargando favoritos:', err);
        this.loading = false;
        this.presentToast('Error al cargar favoritos');
      },
    });
  }

  onSearchChange() {
    const term = this.searchTerm.toLowerCase();

    this.productosFiltrados = this.productosFavoritos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(term) ||
        p.supermercado?.toLowerCase().includes(term)
    );
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'danger', // O 'success', según el tipo de mensaje
    });
    toast.present();
  }

  toggleFavorito(producto: any) {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.favoritesService
      .removeFavorite(user.id_usuario, producto.id)
      .subscribe({
        next: () => {
          this.productosFavoritos = this.productosFavoritos.filter(
            (p) => p.id !== producto.id
          );
          this.productosFiltrados = this.productosFiltrados.filter(
            (p) => p.id !== producto.id
          );
          this.presentToast('Producto eliminado de favoritos');
        },
        error: (err) => {
          console.error('Error al eliminar favorito:', err);
          this.presentToast('Error al eliminar el producto');
        },
      });
  }

  goToProduct(producto: any) {
    console.log('Redirigiendo a producto:', producto.id);
    this.router.navigate(['/producto', producto.id]);
  }
  // Ordenar productos
  sortBy(category: string, order: string) {
    console.log(`Ordenando por ${category} en orden ${order}`);
  }

  // Añadir producto a favoritos
  addToFavorites(product: any) {
    console.log(`Añadido ${product.name} a favoritos`);
  }

  openPopover(event: Event) {
    this.popoverEvent = event;
    this.isPopoverOpen = true;
  }

  goToProducto() {
    this.isPopoverOpen = false;
    setTimeout(() => this.router.navigate(['/buscar-producto']), 100);
  }
}
