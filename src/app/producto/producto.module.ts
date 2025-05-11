import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductoPage } from './producto.page'; // 👈

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProductoPage,
      },
    ])
  ],
  // ❌ Elimina esta línea si aparece
  // declarations: [ProductoPage]
})
export class ProductoPageModule {}
