import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritosPage } from './favoritos.page';

const routes: Routes = [
  {
    path: '',
    component: FavoritosPage // 🔥 Ahora no usamos `loadChildren`
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoritosPageRoutingModule {}
