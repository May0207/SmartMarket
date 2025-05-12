import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritosPage } from './favoritos.page';
import { AuthGuard } from 'app/guards/auth.guard';

const routes: Routes = [
  {
  path: '',
  component: FavoritosPage,
  canActivate: [AuthGuard]
  },
  {
    path: '',
    component: FavoritosPage 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoritosPageRoutingModule {}
