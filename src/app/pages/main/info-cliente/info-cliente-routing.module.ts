import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoClientePage } from './info-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: InfoClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoClientePageRoutingModule {}
