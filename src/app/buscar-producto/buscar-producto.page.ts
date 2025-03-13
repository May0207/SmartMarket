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

  constructor(private router: Router) {}
  // Variables para controlar los dropdowns
  showSupermarkets = false;
  showPrice = false;
  showNutrition = false;

  // Filtros de supermercados
  filters = {
    dia: false,
    carrefour: false,
    hipercor: false,
  };

  // Rango de precio
  priceRange = 250;

  // Lista de productos (ejemplo)
  products = [
    { 
      name: 'Nombre del producto 1', 
      store: 'Supermercado', 
      price: 20, 
      precioPorUnidad: '2.50€/kg' 
    },
    { 
      name: 'Nombre del producto 2', 
      store: 'Supermercado', 
      price: 30, 
      precioPorUnidad: '3.00€/unidad' 
    },
    { 
      name: 'Nombre del producto 3', 
      store: 'Supermercado', 
      price: 40, 
      precioPorUnidad: '1.80€/litro' 
    },
    { 
      name: 'Nombre del producto 4', 
      store: 'Supermercado', 
      price: 20, 
      precioPorUnidad: '0.90€/100g' 
    },
    { 
      name: 'Nombre del producto 5', 
      store: 'Supermercado', 
      price: 30, 
      precioPorUnidad: '4.50€/kg' 
    },
    { 
      name: 'Nombre del producto 6', 
      store: 'Supermercado', 
      price: 40, 
      precioPorUnidad: '2.20€/litro' 
    },
  ];

  // Alternar visibilidad de los dropdowns
  toggleDropdown(filter: string) {
    this.showSupermarkets = filter === 'supermarkets' ? !this.showSupermarkets : false;
    this.showPrice = filter === 'price' ? !this.showPrice : false;
    this.showNutrition = filter === 'nutrition' ? !this.showNutrition : false;
  }

  // Aplicar filtros de supermercados y precio
  applyFilters() {
    console.log('Filtros aplicados:', this.filters, 'Precio:', this.priceRange);
  }

  // Aplicar filtros de información nutricional
  applyNutritionFilter(filterType: string) {
    console.log('Filtro aplicado:', filterType);
    // Aquí puedes implementar la lógica para filtrar los productos según la opción seleccionada
    switch (filterType) {
      case 'lessCalories':
        console.log('Filtrar por menos calorías');
        break;
      case 'moreCalories':
        console.log('Filtrar por más calorías');
        break;
      case 'lessProtein':
        console.log('Filtrar por menos proteínas');
        break;
      case 'moreProtein':
        console.log('Filtrar por más proteínas');
        break;
      case 'lessCarbs':
        console.log('Filtrar por menos hidratos');
        break;
      case 'moreCarbs':
        console.log('Filtrar por más hidratos');
        break;
      case 'lessFat':
        console.log('Filtrar por menos grasas');
        break;
      case 'moreFat':
        console.log('Filtrar por más grasas');
        break;
      case 'lessSugar':
        console.log('Filtrar por menos azúcares');
        break;
      case 'moreSugar':
        console.log('Filtrar por más azúcares');
        break;
      default:
        console.log('Opción no válida');
    }
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
    console.log("Ir a Inicio");
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
}