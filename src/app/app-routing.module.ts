import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoginPage } from './login/login.page';
import { FavoritosPage } from './favoritos/favoritos.page';
import { ProductoPage } from './producto/producto.page';
import { PerfilPage } from './perfil/perfil.page';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.page').then((m) => m.RegisterPage),
  },

  {
    path: 'buscar-producto',
    loadChildren: () =>
      import('./buscar-producto/buscar-producto.module').then(
        (m) => m.BuscarProductoPageModule
      ),
  },
  {
    path: 'favoritos',
    component: FavoritosPage,
  },
  {
    path: 'perfil',
    component: PerfilPage,
  },
  {
    path: 'producto',
    loadChildren: () =>
      import('./producto/producto.module').then((m) => m.ProductoPageModule),
  },
  {
    path: 'inicio',
    loadChildren: () =>
      import('./inicio/inicio.module').then((m) => m.InicioPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
