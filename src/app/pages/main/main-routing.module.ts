import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'rutero',
        loadChildren: () => import('./rutero/rutero.module').then( m => m.RuteroPageModule)
      },
      {
        path: 'verificados',
        loadChildren: () => import('./verificados/verificados.module').then( m => m.VerificadosPageModule)
      },
      {
        path: 'caja',
        loadChildren: () => import('./caja/caja.module').then( m => m.CajaPageModule)
      },
      {
        path: 'cliente-nuevo',
        loadChildren: () => import('./cliente-nuevo/cliente-nuevo.module').then( m => m.ClienteNuevoPageModule)
      },
      {
        path: 'historial-pagos',
        loadChildren: () => import('./historial-pagos/historial-pagos.module').then( m => m.HistorialPagosPageModule)
      },
      {
        path: 'info-cliente',
        loadChildren: () => import('./info-cliente/info-cliente.module').then( m => m.InfoClientePageModule)
      },
      {
        path: 'oficina',
        loadChildren: () => import('./oficina/oficina.module').then( m => m.OficinaPageModule)
      },
      {
        path: 'pago',
        loadChildren: () => import('./pago/pago.module').then( m => m.PagoPageModule)
      },
      {
        path: 'renovaciones',
        loadChildren: () => import('./renovaciones/renovaciones.module').then( m => m.RenovacionesPageModule)
      },
      {
        path: 'renovar',
        loadChildren: () => import('./renovar/renovar.module').then( m => m.RenovarPageModule)
      },
      {
        path: 'update-pago',
        loadChildren: () => import('./update-pago/update-pago.module').then( m => m.UpdatePagoPageModule)
      },
      {
        path: 'enrutador',
        loadChildren: () => import('./enrutador/enrutador.module').then( m => m.EnrutadorPageModule)
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
