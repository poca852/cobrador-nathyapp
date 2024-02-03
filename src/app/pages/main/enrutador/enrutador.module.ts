import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { EnrutadorPageRoutingModule } from './enrutador-routing.module';

import { EnrutadorPage } from './enrutador.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    EnrutadorPageRoutingModule
  ],
  declarations: [EnrutadorPage]
})
export class EnrutadorPageModule {}
