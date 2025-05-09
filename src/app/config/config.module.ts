import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigPageRoutingModule } from './config-routing.module';

import { ConfigPage } from './config.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigPageRoutingModule,
    ConfigPage,
  ],
})
export class ConfigPageModule {}
