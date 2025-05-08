import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  productosFavoritos: any[] = [];

  popoverEvent: Event | null = null;
  isPopoverOpen: boolean = false; 

  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  
  
  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
  
    this.favoritesService.getFavorites(user.id_usuario).subscribe({
      next: (data) => this.productosFavoritos = data,
      error: (err) => {
        console.error('Error cargando favoritos:', err);
      }
    });
  }
  

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'danger' // O 'success', según el tipo de mensaje
    });
    toast.present();
  }
  
  toggleFavorito(producto: any) {
    const user = this.authService.getCurrentUser();
    if (!user) return;
  
    this.favoritesService.removeFavorite(user.id_usuario, producto.id).subscribe({
      next: () => {
        this.productosFavoritos = this.productosFavoritos.filter(p => p.id !== producto.id);
        this.presentToast('Producto eliminado de favoritos');
      },
      error: (err) => {
        console.error('Error al eliminar favorito:', err);
        this.presentToast('Error al eliminar el producto');
      }
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

  // Navegación
  goToHome() {
    this.router.navigate(['/buscar-producto']);
  }

  goToFavorites() {
    console.log('Ir a Favoritos');
  }

  goToProfile() {
    console.log('Ir a Perfil');
  }

  goToSettings() {
    console.log('Ir a Configuración');
  }

  logout() {
    console.log('Cerrar Sesión');
  }

  irAFavoritos() {
    this.router.navigate(['/favoritos']);
  }
  openPopover(event: Event) {
    this.popoverEvent = event;
    this.isPopoverOpen = true;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
