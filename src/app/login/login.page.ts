import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/buscar-producto']);
    } catch (error) {
      console.error('Error en login:', error);
      const toast = await this.toastCtrl.create({
        message: (error as any)?.error?.error || 'Error al iniciar sesión',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
