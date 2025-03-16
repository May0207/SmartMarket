import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import Chart, { ChartConfiguration, registerables } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  styleUrls: ['./producto.page.scss'],
})

export class ProductoPage implements AfterViewInit {  
  product: any;

  producto = {
    nombre: 'Platano de Canarias',
    imagen: 'assets/platanos.jpg',
    supermercadoLogo: 'assets/carrefour.png',
    supermercado: 'Carrefour',
    precio: '2.00',
    precioUnidad: '4.00'
    
  };

  constructor(private route: ActivatedRoute, private router: Router ) {}
  showSupermarkets = false;
  showPrice = false;
  showNutrition = false;

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    console.log('Producto cargado con ID:', productId); // ✅ Debug: Verifica en la consola

    // Aquí puedes hacer una consulta a una API o buscar en una lista de productos
    this.product = { id: productId, name: 'Producto Ejemplo', store: 'Supermercado X', price: '10.00' };
  }

  cerrarPagina() {
    // Lógica para cerrar la página
    console.log('Cerrando página...');
  }

  ngAfterViewInit() {
    this.cargarGraficas();
  }

  cargarGraficas() {
    Chart.register(...registerables); // ✅ Registra los controladores necesarios

    new Chart('nutritionalChart', {
      type: 'pie', // ✅ Ahora el gráfico "pie" se reconoce correctamente
      data: {
        labels: ['Proteína', 'Carbohidratos', 'Grasas'],
        datasets: [{
          data: [20, 50, 30],
          backgroundColor: ['#6A5ACD', '#20B2AA', '#FFA07A']
        }]
      }
    });

    new Chart('priceChart', {
      type: 'line',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        datasets: [{
          label: 'Precio (€)',
          data: [100, 150, 130, 180, 170],
          borderColor: '#6A5ACD',
          fill: true,
          backgroundColor: 'rgba(106, 90, 205, 0.2)'
        }]
      }
    });
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
}

