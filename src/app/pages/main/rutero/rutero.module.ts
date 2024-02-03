import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RuteroPageRoutingModule } from './rutero-routing.module';

import { RuteroPage } from './rutero.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RuteroPageRoutingModule
  ],
  declarations: [RuteroPage]
})
export class RuteroPageModule {}
