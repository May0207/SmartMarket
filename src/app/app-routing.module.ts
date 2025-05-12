import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () =>
      import('./inicio/inicio.page').then((m) => m.InicioPage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'buscar-producto',
    loadComponent: () =>
      import('./buscar-producto/buscar-producto.page').then((m) => m.BuscarProductoPage),
  },
  {
    path: 'producto/:id',
    loadComponent: () =>
      import('./producto/producto.page').then((m) => m.ProductoPage),
  },
  {
    path: 'perfil',
    loadChildren: () =>
      import('./perfil/perfil.module').then((m) => m.PerfilPageModule)
  },
  {
    path: 'favoritos',
    loadComponent: () =>
      import('./favoritos/favoritos.page').then((m) => m.FavoritosPage),
  },
  {
    path: 'config',
    loadComponent: () =>
      import('./config/config.page').then((m) => m.ConfigPage),
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
