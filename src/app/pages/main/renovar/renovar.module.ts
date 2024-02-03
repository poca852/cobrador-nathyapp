import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { RenovarPageRoutingModule } from './renovar-routing.module';

import { RenovarPage } from './renovar.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RenovarPageRoutingModule
  ],
  declarations: [RenovarPage]
})
export class RenovarPageModule {}
