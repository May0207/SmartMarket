import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductoPage } from './producto.page';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProductoPage, // Solo si es standalone
      },
    ])
  ]
})
export class ProductoPageModule {}
