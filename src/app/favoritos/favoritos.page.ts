import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})



export class FavoritosPage {
product: any;

  constructor(private router: Router) {}
  // Variables para controlar los dropdowns
  showSupermarkets = false;
  showPrice = false;
  showNutrition = false;
  isPopoverOpen = false;
  popoverEvent: any;

  productosFavoritos = [
    {
      id: 1,
      nombre: 'Plátanos 800g',
      supermercado: 'Carrefour',
      precio: '2.50',
      precioUnidad: '0.31',
      imagen: 'assets/platanos.jpg'
    },
    {
      id:2,
      nombre: 'Leche Entera 1L',
      supermercado: 'Día',
      precio: '1.20',
      precioUnidad: '1.20',
      imagen: 'assets/leche.jpg'
    },
    {
      id:3,
      nombre: 'Pan Integral 500g',
      supermercado: 'Hipercor',
      precio: '2.00',
      precioUnidad: '4.00',
      imagen: 'assets/pan-integral.jpeg'
    },
    {
      id:4,
      nombre: 'Plátanos 800g',
      supermercado: 'Carrefour',
      precio: '2.50',
      precioUnidad: '0.31',
      imagen: 'assets/platanos.jpg'
    },
    {
      id:5,
      nombre: 'Leche Entera 1L',
      supermercado: 'Día',
      precio: '1.20',
      precioUnidad: '1.20',
      imagen: 'assets/leche.jpg'
    },
    {
      id:6,
      nombre: 'Pan Integral 500g',
      supermercado: 'Hipercor',
      precio: '2.00',
      precioUnidad: '4.00',
      imagen: 'assets/pan-integral.jpeg'
    }
  ];

  toggleFavorito(producto: any) {
    this.productosFavoritos = this.productosFavoritos.filter(p => p !== producto);
  }

  goToProduct(producto:any) {
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
      console.log("Ir a Favoritos");
    }

    goToProfile() {
      console.log("Ir a Perfil");
    }

    goToSettings() {
      console.log("Ir a Configuración");
    }

    logout() {
      console.log("Cerrar Sesión");
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
