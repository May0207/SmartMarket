import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import Chart, { ChartConfiguration, registerables } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  usuario: any = {
    nombre: '',
    apellido1: '',
    apellido2: '',
    email: '',
    password: '',
  };
  constructor(
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  ionViewWillEnter() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.usuario = { ...user }; // copia los datos del usuario actual
    }
  }

  guardarCambios() {
    const userId = this.usuario.id_usuario;

    this.authService.updateUser(userId, this.usuario).subscribe({
      next: () => {
        this.authService.setCurrentUser(this.usuario);
        this.presentToast('Cambios guardados correctamente');
      },
      error: () => {
        this.presentToast('Error al guardar los cambios');
      },
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    toast.present();
  }
}
