import { Component, OnInit } from '@angular/core';
import { UserService } from 'services/user.service';
import { ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule],
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage {
  usuarios: any[] = [];
  constructor(
    private userService: UserService,
    private toastController: ToastController
  ) {}

  ionViewWillEnter() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        console.log('Usuarios recibidos:', data); // 👈 Asegúrate de ver esto en la consola
        this.usuarios = data as any[];
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      },
    });
  }

  cambiarRol(user: any) {
    const nuevoRol = user.rol === 'admin' ? 'cliente' : 'admin';
    this.userService.updateUserRole(user.id_usuario, nuevoRol).subscribe({
      next: () => {
        user.rol = nuevoRol;
        this.presentToast(`Rol actualizado a ${nuevoRol}`);
      },
      error: () => this.presentToast('Error al actualizar rol'),
    });
  }

  eliminarUsuario(user: any) {
    this.userService.deleteUser(user.id_usuario).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(
          (u) => u.id_usuario !== user.id_usuario
        );
        this.presentToast('Usuario eliminado');
      },
      error: () => this.presentToast('Error al eliminar usuario'),
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }
}
