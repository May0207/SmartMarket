import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  nombre = '';
  apellido1 = '';
  apellido2 = '';
  email = '';
  password = '';
  birthdate = '';

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  async register() {
    try {
      await this.authService.register(
        this.nombre,
        this.apellido1,
        this.apellido2,
        this.email,
        this.password,
        this.birthdate
      );
      const toast = await this.toastCtrl.create({
        message: 'Registro exitoso',
        duration: 2000,
        color: 'success',
      });
      toast.present();
      this.navCtrl.navigateForward('/login');
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: (error as any)?.error?.error || 'Error al registrar usuario',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
    }
  }

  goToLogin() {
    this.navCtrl.navigateBack('/login');
  }
}
