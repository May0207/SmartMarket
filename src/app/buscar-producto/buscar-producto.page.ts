import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscar-producto',
  templateUrl: './buscar-producto.page.html',
  styleUrls: ['./buscar-producto.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class BuscarProductoPage {
  showSupermarkets = false;
  showPrice = false;
  showNutrition = false;
  isPopoverOpen = false;
  popoverEvent: any;

  filters = {
    dia: false,
    carrefour: false,
    hipercor: false,
  };

  priceRange = 250;

  products = [
    { id: 1, name: 'Producto 1', store: 'Supermercado', price: 20, precioPorUnidad: '2.50€/kg' },
    { id: 2, name: 'Producto 2', store: 'Supermercado', price: 30, precioPorUnidad: '3.00€/unidad' },
    { id: 3, name: 'Producto 3', store: 'Supermercado', price: 40, precioPorUnidad: '1.80€/litro' },
    { id: 4, name: 'Producto 4', store: 'Supermercado', price: 20, precioPorUnidad: '0.90€/100g' },
    { id: 5, name: 'Producto 5', store: 'Supermercado', price: 30, precioPorUnidad: '4.50€/kg' },
    { id: 6, name: 'Producto 6', store: 'Supermercado', price: 40, precioPorUnidad: '2.20€/litro' },
  ];

  constructor(private router: Router) {}

  toggleDropdown(filter: string) {
    this.showSupermarkets = filter === 'supermarkets' ? !this.showSupermarkets : false;
    this.showPrice = filter === 'price' ? !this.showPrice : false;
    this.showNutrition = filter === 'nutrition' ? !this.showNutrition : false;
  }

  applyFilters() {
    console.log('Filtros aplicados:', this.filters, 'Precio:', this.priceRange);
  }

  applyNutritionFilter(filterType: string) {
    console.log('Filtro aplicado:', filterType);
    const filterMessages: { [key: string]: string } = {
      lessCalories: 'Filtrar por menos calorías',
      moreCalories: 'Filtrar por más calorías',
      lessProtein: 'Filtrar por menos proteínas',
      moreProtein: 'Filtrar por más proteínas',
      lessCarbs: 'Filtrar por menos hidratos',
      moreCarbs: 'Filtrar por más hidratos',
      lessFat: 'Filtrar por menos grasas',
      moreFat: 'Filtrar por más grasas',
      lessSugar: 'Filtrar por menos azúcares',
      moreSugar: 'Filtrar por más azúcares',
    };
    console.log(filterMessages[filterType] || 'Opción no válida');
  }

  sortBy(category: string, order: string) {
    console.log(`Ordenando por ${category} en orden ${order}`);
  }

  goToProduct(product: any) {
    console.log('Redirigiendo a producto:', product.id);
    this.router.navigate(['/producto', product.id]);
  }

  addToFavorites(product: any) {
    console.log(`Añadido ${product.name} a favoritos`);
  }

  goToHome() {
    this.router.navigate(['/buscar-producto']);
  }

  goToFavorites() {
    this.router.navigate(['/favoritos']);
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

  // Métodos añadidos para corregir los errores

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
