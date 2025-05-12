import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfilPage } from './perfil.page';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PerfilPage,
    canActivate: [AuthGuard]  // 👈 Igual que favoritos
  },
  {
    path: '',
    component: PerfilPage,
  },
  {
    path: ':id',
    component: PerfilPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilPageRoutingModule {}
