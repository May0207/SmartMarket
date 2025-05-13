import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { FavoritesService } from '../../services/favorites.service';

interface Producto {
  id: number;
  name: string;
  store: string;
  categoria: string;
  subcategoria?: string;
  imagen?: string;
  url?: string;
  precio: number;
  precio_por_unidad?: string;
  calorias?: string;
  proteinas?: string;
  hidratos_carbono?: string;
  grasas?: string;
  azucares?: string;
  supermercado?: string;
}

@Component({
  selector: 'app-buscar-producto',
  templateUrl: './buscar-producto.page.html',
  styleUrls: ['./buscar-producto.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class BuscarProductoPage {
  isLoggedIn = false;
  products: Producto[] = [];
  favoritosIds: number[] = [];
  loading = false;
  error = false;
  currentPage = 1;
  limit = 28;
  offset = 0;
  noMoreProducts = false;

  showSupermarkets = false;
  showPrice = false;
  showNutrition = false;
  isPopoverOpen = false;
  popoverEvent: any;
  priceRange = 250;
  searchTerm = '';
  nutritionFilter: { field: string; direction: 'asc' | 'desc' } | null = null;

  filters = {
    dia: false,
    carrefour: false,
    hipercor: false,
  };

  constructor(
    public authService: AuthService,
    private router: Router,
    private apiService: ApiService,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private favoritesService: FavoritesService
  ) {}

  ionViewWillEnter() {
    this.loadProducts(); // 👈 sigue cargando los productos

    const user = this.authService.getCurrentUser();
    if (user) {
      this.favoritesService.getFavorites(user.id_usuario).subscribe({
        next: (data) => {
          this.favoritosIds = data.map((p) => p.id);
        },
        error: (err) => console.error('Error cargando favoritos:', err),
      });
    } else {
      this.favoritosIds = []; // vaciar por si no hay sesión
    }
  }

  loadPage(page: number) {
    this.offset = (page - 1) * this.limit;
    this.currentPage = page;
    this.products = [];
    this.loadProducts();
  }

  nextPage() {
    this.loadPage(this.currentPage + 1);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  loadProducts() {
    this.loading = true;
    this.error = false;

    const filtros = {
      precioMax: this.priceRange,
      supermercados: Object.entries(this.filters)
        .filter(([_, val]) => val)
        .map(([key]) => key),
      search: this.searchTerm.trim(),
      nutritionField: this.nutritionFilter?.field,
      nutritionOrder: this.nutritionFilter?.direction,
    };

    this.apiService.getProductos(this.limit, this.offset, filtros).subscribe({
      next: (data: any[]) => {
        this.products = [...this.products, ...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = true;
        this.loading = false;
      },
    });
  }

  confirmLogout() {
    this.alertCtrl
      .create({
        header: 'Cerrar sesión',
        message: '¿Estás seguro de que quieres cerrar sesión?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Cerrar sesión',
            handler: () => {
              this.authService.logout();
              this.favoritosIds = [];
              this.isPopoverOpen = false;
              // Redirije por que no actualiza el sidebar
              this.isPopoverOpen = false;
              setTimeout(() => this.router.navigate(['/inicio']), 100);
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  logout() {
    this.confirmLogout();
  }

  presentPopover(ev: any) {
    this.popoverEvent = ev;
    this.isPopoverOpen = true;
  }

  goToLogin() {
    this.isPopoverOpen = false;
    setTimeout(() => this.router.navigate(['/login']), 100);
  }

  goToRegister() {
    this.isPopoverOpen = false;
    setTimeout(() => this.router.navigate(['/register']), 100);
  }

  goToProduct(product: Producto) {
    this.router.navigate(['/producto', product.id]);
  }

  toggleDropdown(filter: string) {
    this.showSupermarkets =
      filter === 'supermarkets' ? !this.showSupermarkets : false;
    this.showPrice = filter === 'price' ? !this.showPrice : false;
    this.showNutrition = filter === 'nutrition' ? !this.showNutrition : false;
  }

  loadFilteredProducts() {
    this.offset = 0;
    this.products = [];
    this.loadProducts();
  }

  onSearchChange() {
    this.offset = 0;
    this.products = [];
    this.loadProducts();
  }

  getSuperLogo(supermercado: string): string {
    if (!supermercado) return 'assets/default-logo.png';

    const nombre = supermercado.toLowerCase().trim();

    if (nombre.includes('carrefour')) return 'assets/carrefour-logo.png';
    if (nombre.includes('dia')) return 'assets/dia.png';
    if (nombre.includes('hipercor')) return 'assets/hipercor.png';
    if (nombre.includes('eroski')) return 'assets/eroski.png';

    return 'assets/default-logo.png';
  }

  resetFilters() {
    this.filters = {
      dia: false,
      carrefour: false,
      hipercor: false,
    };

    this.priceRange = 250;
    this.searchTerm = '';
    this.nutritionFilter = null;
    this.offset = 0;
    this.products = [];

    this.loadProducts();
  }

  openUrl(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  retryLoad() {
    this.loadProducts();
  }

  setNutritionFilter(type: string) {
    const map: any = {
      calorias_mas: { field: 'calorias', direction: 'desc' },
      calorias_menos: { field: 'calorias', direction: 'asc' },
      proteinas_mas: { field: 'proteinas', direction: 'desc' },
      proteinas_menos: { field: 'proteinas', direction: 'asc' },
      grasas_mas: { field: 'grasas', direction: 'desc' },
      grasas_menos: { field: 'grasas', direction: 'asc' },
      hidratos_mas: { field: 'hidratos_carbono', direction: 'desc' },
      hidratos_menos: { field: 'hidratos_carbono', direction: 'asc' },
      azucares_mas: { field: 'azucares', direction: 'desc' },
      azucares_menos: { field: 'azucares', direction: 'asc' },
    };

    this.nutritionFilter = map[type];
    this.offset = 0;
    this.products = [];
    this.showNutrition = false;
    this.loadProducts();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  addToFavorites(product: any) {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.presentToast('Debes iniciar sesión para guardar favoritos');
      return;
    }

    this.favoritesService.addFavorite(user.id_usuario, product).subscribe({
      next: () => {
        // ✅ Añadimos el ID a favoritosIds si no estaba ya
        if (!this.favoritosIds.includes(product.id)) {
          this.favoritosIds.push(product.id);
        }

        this.presentToast('Producto añadido a favoritos');
      },
      error: (err) => {
        console.error('Error al añadir a favoritos:', err);
        this.presentToast('Error al añadir a favoritos');
      },
    });
  }

  esFavorito(idProducto: number): boolean {
    return this.favoritosIds.includes(idProducto);
  }

  toggleFavorito(producto: any) {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    if (this.esFavorito(producto.id)) {
      // Eliminar de favoritos
      this.favoritesService
        .removeFavorite(user.id_usuario, producto.id)
        .subscribe({
          next: () => {
            this.favoritosIds = this.favoritosIds.filter(
              (id) => id !== producto.id
            );
            this.presentToast('Eliminado de favoritos');
          },
          error: () => this.presentToast('Error al eliminar'),
        });
    } else {
      // Añadir a favoritos
      this.favoritesService.addFavorite(user.id_usuario, producto).subscribe({
        next: () => {
          this.favoritosIds.push(producto.id);
          this.presentToast('Añadido a favoritos');
        },
        error: () => this.presentToast('Error al añadir'),
      });
    }
  }
}
