import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-favoritos',
  standalone: true, // 🔥 Esto es clave para evitar problemas con NgModule
  imports: [CommonModule, IonicModule],
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage {}
