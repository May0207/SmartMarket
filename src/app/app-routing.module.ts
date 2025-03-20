import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { FavoritosPage } from './favoritos/favoritos.page';
import { ProductoPage } from './producto/producto.page';

const routes: Routes = [
  { path: '', redirectTo: 'buscar-producto', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./register/register.page').then(m => m.RegisterPage) },
  {
    path: 'buscar-producto',
    loadChildren: () => import('./buscar-producto/buscar-producto.module').then( m => m.BuscarProductoPageModule)
  },
  {
    path: 'favoritos',
    component: FavoritosPage,
  },
  {
    path: 'producto',
    loadChildren: () => import('./producto/producto.module').then(m => m.ProductoPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
