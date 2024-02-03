import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenovarPage } from './renovar.page';

const routes: Routes = [
  {
    path: '',
    component: RenovarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenovarPageRoutingModule {}
