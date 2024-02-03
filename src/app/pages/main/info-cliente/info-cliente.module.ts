import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { InfoClientePageRoutingModule } from './info-cliente-routing.module';

import { InfoClientePage } from './info-cliente.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    InfoClientePageRoutingModule
  ],
  declarations: [InfoClientePage]
})
export class InfoClientePageModule {}
