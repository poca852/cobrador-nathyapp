import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Cliente, Credito, Pago } from 'src/app/models';
import { PagosService } from 'src/app/services/pagos.service';
import { UtilsService } from '../../../services/utils.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { CreditoService } from 'src/app/services/credito.service';
import { BuildComprobante } from 'src/app/helpers/get-comprobante';

@Component({
  selector: 'app-verificados',
  templateUrl: './verificados.page.html',
  styleUrls: ['./verificados.page.scss'],
})
export class VerificadosPage {

  pagosService = inject(PagosService);
  utilsSvc = inject(UtilsService);
  creditoService = inject(CreditoService);
  clienteService = inject(ClienteService);
  router = inject(Router);
  comunicacionService = inject(NotificacionesService);

  private pagos: Pago[] = [];
  public pagosFiltrados: Pago[] = [];
  private updatedPagoSubscripcion: Subscription;
  private logoutSubscription: Subscription;
  public loading: boolean = true;

  constructor() {

    this.updatedPagoSubscripcion = this.comunicacionService.updatePago$
      .subscribe(() => {
        this.loading = true;
        this.getPagos();
      })

  }

  ionViewWillEnter() {
    this.getPagos()
  }

  ionViewWillLeave() {
    this.updatedPagoSubscripcion.unsubscribe();
  }

  doRefresh(event: any) {    
    this.loading = true;
    setTimeout(() => {
      this.getPagos()
      event.target.complete();
    }, 1000);
  }

  private async shareComprobante() {
    const resumen = BuildComprobante.execute(this.creditoService.currentCredit(), this.clienteService.currentClient());
    
    await this.utilsSvc.share({
      title: `Resumen credito de ${this.clienteService.currentClient().nombre}`,
      text: resumen
    })
  }

  private resetComponent() {
    this.loading = true;
    this.pagos = [];
    this.pagosFiltrados = [];
  }

  private getPagos() {
    this.pagosService.getPagos()
      .subscribe({
        next: pagos => {
          this.pagos = pagos
          this.pagosFiltrados = [...pagos]
          this.loading = false;
        }
      })
  }

  filtrarClientes(termino: string) {
    if (termino === '') {
      this.pagosFiltrados = [...this.pagos]
    }

    const normalizedQuery = termino.toLowerCase();
    this.pagosFiltrados = this.pagos.filter((item) => {
      return item.cliente!.alias.toLowerCase().includes(normalizedQuery);
    });
  }

  async presentActionSheet(pago: Pago) {

    this.creditoService.setCurrentCredit(pago.credito as Credito)
    this.clienteService.setCurrentClient(pago.cliente as Cliente)

    await this.utilsSvc.presentActionSheet({
      header: `Acciones para ${pago.cliente?.alias.toLowerCase()}`,
      mode: 'ios',
      buttons: [
        {
          text: 'Actualizar Pago',
          handler: () => {
            this.router.navigateByUrl(`/main/update-pago`);
          }
        },
        {
          text: 'Compartir Pago',
          icon: 'share-social',
          handler: () => {
            this.shareComprobante()
          }
        },
        {
          text: 'Informacion del Cliente',
          handler: () => {
            this.router.navigateByUrl('/main/info-cliente');
          }
        },
        {
          text: 'Historial de Pagos',
          handler: () => {
            this.router.navigateByUrl('/main/historial-pagos')
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.creditoService.removeCurrentCredit();
            this.clienteService.removeCurrentClient();
          }
        },
      ],
    });
  }

}
