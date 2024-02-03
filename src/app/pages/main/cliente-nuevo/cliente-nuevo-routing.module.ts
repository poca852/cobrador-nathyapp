import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClienteNuevoPage } from './cliente-nuevo.page';

const routes: Routes = [
  {
    path: '',
    component: ClienteNuevoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClienteNuevoPageRoutingModule {}
