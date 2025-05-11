import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class InicioPage implements OnInit {
  images = ['assets/bg1.jpg', 'assets/bg2.jpg', 'assets/bg3.jpg'];
  currentImage: string = this.images[0];
  imageIndex = 0;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    setInterval(() => {
      this.imageIndex = (this.imageIndex + 1) % this.images.length;
      this.currentImage = this.images[this.imageIndex];
    }, 10000);
  }

  ionViewWillEnter() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/buscar-producto']);
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
