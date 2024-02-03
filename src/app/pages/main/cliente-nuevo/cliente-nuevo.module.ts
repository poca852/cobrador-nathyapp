import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ClienteNuevoPageRoutingModule } from './cliente-nuevo-routing.module';

import { ClienteNuevoPage } from './cliente-nuevo.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    ClienteNuevoPageRoutingModule
  ],
  declarations: [ClienteNuevoPage]
})
export class ClienteNuevoPageModule {}
