import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import Chart, { ChartConfiguration, registerables } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  constructor() {}

  ngOnInit() {}

  // Navegación
  goToHome() {
    console.log('Ir a Inicio');
  }

  goToFavorites() {
    console.log('Ir a Favoritos');
  }

  goToProfile() {
    console.log('Ir a Perfil');
  }

  goToSettings() {
    console.log('Ir a Configuración');
  }

  logout() {
    console.log('Cerrar Sesión');
  }

  irAFavoritos() {
    console.log('Ir a Favoritos');
  }
}
