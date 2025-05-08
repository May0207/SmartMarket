import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  mostrarSidebar = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const rutasSinSidebar = ['/inicio', '/login', '/register'];
        this.mostrarSidebar = !rutasSinSidebar.includes(event.url);
      }
    });
  }

  goToHome() {
    this.router.navigate(['/inicio']);
  }

  irAFavoritos() {
    this.router.navigate(['/favoritos']);
  }

  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToSettings() {
    // Agrega tu ruta de configuración si la tienes
    this.router.navigate(['/configuracion']);
  }

  logout() {
    // Aquí podrías limpiar el token de sesión, etc.
    this.router.navigate(['/login']);
  }
}
