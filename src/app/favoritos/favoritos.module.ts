import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FavoritosPage } from './favoritos.page';
import { FavoritosPageRoutingModule } from './favoritos-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoritosPageRoutingModule,  // 👈 Importa el routing con AuthGuard
    FavoritosPage
],
})
export class FavoritosPageModule {}
