import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { RetiroOficinaComponent } from './components/retiro-oficina/retiro-oficina.component';
import { GastoOficinaComponent } from './components/gasto-oficina/gasto-oficina.component';
import { InversionOficinaComponent } from './components/inversion-oficina/inversion-oficina.component';
import { PagoFijoComponent } from './components/pago-fijo/pago-fijo.component';
import { PagoVariableComponent } from './components/pago-variable/pago-variable.component';
import { PagoHistorialComponent } from './components/pago-historial/pago-historial.component';
import { HistorialCreditosComponent } from './components/historial-creditos/historial-creditos.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LogoComponent,
    CustomInputComponent,
    SearchBarComponent,
    RetiroOficinaComponent,
    GastoOficinaComponent,
    InversionOficinaComponent,
    PagoFijoComponent,
    PagoVariableComponent,
    PagoHistorialComponent,
    HistorialCreditosComponent
  ],
  exports: [
    ReactiveFormsModule,
    HeaderComponent,
    LogoComponent,
    CustomInputComponent,
    SearchBarComponent,
    RetiroOficinaComponent,
    GastoOficinaComponent,
    InversionOficinaComponent,
    PagoFijoComponent,
    PagoVariableComponent,
    PagoHistorialComponent,
    HistorialCreditosComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
