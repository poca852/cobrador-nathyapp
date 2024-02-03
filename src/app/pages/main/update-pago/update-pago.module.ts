import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { UpdatePagoPageRoutingModule } from './update-pago-routing.module';

import { UpdatePagoPage } from './update-pago.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    UpdatePagoPageRoutingModule
  ],
  declarations: [UpdatePagoPage]
})
export class UpdatePagoPageModule {}
