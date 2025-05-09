import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import Chart, { ChartConfiguration, registerables } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage {
  images = ['assets/bg1.jpg', 'assets/bg2.jpg', 'assets/bg3.jpg'];
  currentImage: string = this.images[0];
  imageIndex = 0;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    setInterval(() => {
      this.imageIndex = (this.imageIndex + 1) % this.images.length;
      this.currentImage = this.images[this.imageIndex];
    }, 10000); // cambia cada 5 segundos
  }

  ionViewWillEnter() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/buscar-producto']); // o donde quieras redirigir
    }
  }

  goToProductos() {
    this.router.navigate(['/buscar-producto']);
  }

  goToLogin() {
    setTimeout(() => this.router.navigate(['/login']), 100);
  }

  contactar() {
    window.open('mailto:contacto@comparapp.com', '_blank');
  }
}
