import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { VerificadosPageRoutingModule } from './verificados-routing.module';

import { VerificadosPage } from './verificados.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    VerificadosPageRoutingModule
  ],
  declarations: [VerificadosPage]
})
export class VerificadosPageModule {}
