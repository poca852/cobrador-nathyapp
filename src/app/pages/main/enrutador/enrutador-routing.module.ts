import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnrutadorPage } from './enrutador.page';

const routes: Routes = [
  {
    path: '',
    component: EnrutadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnrutadorPageRoutingModule {}
