import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-producto',
  standalone: true,
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
  imports: [CommonModule, IonicModule, HttpClientModule]
})
export class ProductoPage implements OnInit {
  producto: any = {};
  supermercadoLogo: string = '';
  esFavorito: boolean = false;
  userId: string | null = null;

  @ViewChild('nutritionalChart') nutritionalChartRef!: ElementRef;
  @ViewChild('priceChart') priceChartRef!: ElementRef;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.userId = localStorage.getItem('userId');

    if (id) {
      this.loadProducto(id);
    }
  }

  loadProducto(id: string) {
    const url = `http://localhost:3000/api/productos/${id}`;
    this.http.get(url).subscribe({
      next: (data: any) => {
        this.producto = data;

        const nombre = (data.supermercado || '').toLowerCase().trim();

        if (nombre.includes('carrefour')) {
          this.supermercadoLogo = 'assets/carrefour-logo.png';
        } else if (nombre.includes('dia')) {
          this.supermercadoLogo = 'assets/dia.png';
        } else if (nombre.includes('hipercor')) {
          this.supermercadoLogo = 'assets/hipercor.png';
        } else if (nombre.includes('eroski')) {
          this.supermercadoLogo = 'assets/eroski.png';
        } else {
          this.supermercadoLogo = 'assets/logo.png';
        }

        setTimeout(() => this.renderChart(), 0);
        setTimeout(() => this.renderPriceChart(), 0);

        if (this.userId) {
          this.checkFavorito();
        }
      },
      error: (err) => {
        console.error('[ProductoPage] Error al cargar producto:', err);
      }
    });
  }

  renderChart() {
    const allNutrients = {
      Grasas: this.parseNumber(this.producto.grasas),
      Hidratos: this.parseNumber(this.producto.hidratos_carbono),
      Azúcares: this.parseNumber(this.producto.azucares),
      Proteínas: this.parseNumber(this.producto.proteinas)
    };

    const nutrientesFiltrados = Object.entries(allNutrients)
      .filter(([_, value]) => value > 0)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, number>);

    new Chart(this.nutritionalChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: Object.keys(nutrientesFiltrados),
        datasets: [{
          label: 'Valores por 100g',
          data: Object.values(nutrientesFiltrados),
          backgroundColor: ['#FFB347', '#FF8243', '#FFD700', '#FFA07A', '#87CEEB']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(...Object.values(nutrientesFiltrados)) < 10 ? 10 : undefined,
            ticks: {
              stepSize: 2
            }
          }
        }
      }
    });
  }

  renderPriceChart() {
    const ctx = this.priceChartRef.nativeElement;
    const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const data = Array(7).fill(this.parseNumber(this.producto.precio));

    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Precio (€)',
          data,
          borderColor: '#4B0082',
          backgroundColor: '#9370DB',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }

  parseNumber(value: any): number {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value === null || value === undefined || value === '' ? 0 : parsed;
  }

  cerrarPagina() {
    history.back();
  }

  checkFavorito() {
    this.http.get<any[]>(`http://localhost:3000/api/favoritos/${this.userId}`).subscribe({
      next: (favoritos) => {
        this.esFavorito = favoritos.some(f => f.id === this.producto.id);
      },
      error: (err) => {
        console.error('Error al comprobar favoritos:', err);
      }
    });
  }

  anadirAFavoritos() {
    if (!this.userId) {
      alert('Debes iniciar sesión para añadir a favoritos');
      return;
    }

    this.http.post('http://localhost:3000/api/favoritos/add', {
      userId: this.userId,
      productId: this.producto.id
    }).subscribe({
      next: () => {
        this.esFavorito = true;
        alert('Producto añadido a favoritos ✅');
      },
      error: (err) => {
        console.error('Error al añadir a favoritos', err);
        alert('No se pudo añadir a favoritos');
      }
    });
  }
}
