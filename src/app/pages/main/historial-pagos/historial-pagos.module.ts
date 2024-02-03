import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { HistorialPagosPageRoutingModule } from './historial-pagos-routing.module';

import { HistorialPagosPage } from './historial-pagos.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    HistorialPagosPageRoutingModule
  ],
  declarations: [HistorialPagosPage]
})
export class HistorialPagosPageModule {}
