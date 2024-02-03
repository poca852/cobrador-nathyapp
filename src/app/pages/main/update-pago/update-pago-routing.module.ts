import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatePagoPage } from './update-pago.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatePagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatePagoPageRoutingModule {}
