import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IonicModule, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  mostrarSidebar = false;
  isLoggedIn = false;
  rol: string | null = null;
  isPopoverOpen = false;
  popoverEvent: any;
  mostrarChat = false;
  private authSubscription: Subscription;

  constructor(
    private router: Router,
    private auth: AuthService,
    private alertCtrl: AlertController
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const rutasSinSidebar = ['/inicio', '/login', '/register'];
        const currentUrl = event.urlAfterRedirects || event.url;
        this.mostrarSidebar = !rutasSinSidebar.some((ruta) =>
          currentUrl.startsWith(ruta)
        );

        // Estado del usuario
        this.isLoggedIn = this.auth.isLoggedIn();
        this.rol = this.auth.getUserRole();
      }
    });

    // Suscribirse a los cambios de autenticación
    this.authSubscription = this.auth
      .authStateChanged()
      .subscribe((isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigate(['/inicio']);
        }
      });
  }

  ngOnDestroy() {
    // Cancelar la suscripción para evitar fugas de memoria
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  goToHome() {
    this.isPopoverOpen = false;
    setTimeout(() => this.router.navigate(['/inicio']), 100);
  }

  goToFavoritos() {
    this.isPopoverOpen = false;
    setTimeout(() => this.router.navigate(['/favoritos']), 100);
  }

  goToProducto() {
    this.isPopoverOpen = false;
    setTimeout(() => this.router.navigate(['/buscar-producto']), 100);
  }

  goToProfile() {
    this.isPopoverOpen = false;
    setTimeout(() => this.router.navigate(['/perfil']), 100);
  }

  goToRegister() {
    this.isPopoverOpen = false;
    setTimeout(() => this.router.navigate(['/register']), 100);
  }

  goToLogin() {
    this.isPopoverOpen = false;
    setTimeout(() => this.router.navigate(['/login']), 100);
  }

  goToSettings() {
    this.router.navigate(['/config']);
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
              this.auth.logout();
              this.isPopoverOpen = false;

              // 🔄 Fuerza actualización del estado
              this.isLoggedIn = this.auth.isLoggedIn();
              this.rol = this.auth.getUserRole();

              //Opcional: redirige al inicio
              //this.router.navigate(['/inicio']);
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
}
