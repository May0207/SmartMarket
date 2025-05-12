import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

constructor(
  private authService: AuthService,
  private router: Router,
  private toastController: ToastController
) {}

async canActivate(): Promise<boolean> {
  const user = this.authService.getCurrentUser();

  if (user && user.id_usuario) {
    return true;
  } else {
    await this.showAccessDeniedToast();
    this.router.navigate(['/login']);
    return false;
  }
}

private async showAccessDeniedToast() {
  const toast = await this.toastController.create({
    message: 'Debes iniciar sesión para acceder al perfil.',
    duration: 3000,
    position: 'top',
    color: 'warning'
  });

  await toast.present();
}
}
