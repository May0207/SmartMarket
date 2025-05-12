import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

constructor(
  private authService: AuthService,
  private router: Router,
  private toastController: ToastController
) {}

async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
  const user = this.authService.getCurrentUser();

  if (user && user.id_usuario) {
    return true;
  } else {
    let msg = 'Debes iniciar sesión.';
    if (state.url.includes('perfil')) {
      msg = 'Debes iniciar sesión para acceder al perfil.';
    } else if (state.url.includes('favoritos')) {
      msg = 'Debes iniciar sesión para ver tus favoritos.';
    }

    await this.showToast(msg);

    // ✅ Asegura redirección después del toast
    await this.router.navigate(['/login']);
    return false;
  }
}

private async showToast(message: string) {
  const toast = await this.toastController.create({
    message,
    duration: 3000,
    position: 'top',
    color: 'warning'
  });

  await toast.present();
}
}
