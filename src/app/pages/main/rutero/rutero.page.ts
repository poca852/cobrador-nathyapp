import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Cliente, Credito } from 'src/app/models';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { UtilsService } from '../../../services/utils.service';
import { CreditoService } from '../../../services/credito.service';
import { ClienteService } from '../../../services/cliente.service';
import { PagosService } from '../../../services/pagos.service';

@Component({
  selector: 'app-rutero',
  templateUrl: './rutero.page.html',
  styleUrls: ['./rutero.page.scss'],
})
export class RuteroPage implements OnDestroy {

  utilsSvc = inject(UtilsService);
  creditoService = inject(CreditoService);
  notificacionesSvc = inject(NotificacionesService);
  clienteSvc = inject(ClienteService);
  pagoSvc = inject(PagosService);

  public hayError = false;
  public creditos: Credito[] = [];
  public loading = true;
  public creditosFiltrados: Credito[] = [];
  private pagoExitosoSubscription: Subscription;

  constructor() {
    this.pagoExitosoSubscription = this.notificacionesSvc.pagoExitoso$.subscribe(() => {
      this.actualizarListaClientes();
    });
  }

  ngOnDestroy(): void {
    this.pagoExitosoSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.getCreditos();
  }

  doRefresh(event: any) {
    this.loading = true;
    setTimeout(() => {
      this.getCreditos()
      event.target.complete();
    }, 1000);
  }

  filtrarClientes(termino: string): void {
    if (!termino) {
      this.creditosFiltrados = [...this.creditos];
      return;
    }

    const normalizedQuery = termino.toLowerCase();
    this.creditosFiltrados = this.creditos.filter((item) => {
      return item.cliente.alias.toLowerCase().includes(normalizedQuery);
    });
  }

  private actualizarListaClientes() {
    this.getCreditos();
  }

  private getCreditos(): void {
    this.creditoService.getCreditos()
      .subscribe({
        next: (creditos) => {
          this.creditos = creditos;
          this.creditosFiltrados = [...creditos];
          this.loading = false;
        },
        error: () => {
          this.creditos = [];
          this.loading = false;
        }
      });
  }

  async presentActionSheet(credit: Credito): Promise<void> {
    this.creditoService.setCurrentCredit(credit);
    this.clienteSvc.setCurrentClient(credit.cliente);

    await this.utilsSvc.presentActionSheet({
      header: `Acciones para ${credit.cliente.alias.toLowerCase()}`,
      mode: 'ios',
      buttons: [
        {
          text: 'Pagar',
          data: {
            action: 'delete',
          },
          handler: () => {
            this.utilsSvc.routerLink(`/main/pago`);
          }
        },
        {
          text: 'No pago',
          handler: () => {
            this.confirmarNoPagoCliente(credit.cliente);
          }
        },
        {
          text: 'Informacion del Cliente',
          handler: () => {
            this.utilsSvc.routerLink('/main/info-cliente');
          }
        },
        {
          text: 'Historial de Pagos',
          handler: () => {
            this.utilsSvc.routerLink('/main/historial-pagos');
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.cancelAction();
          }
        }
      ]
    });
  }

  private cancelAction() {
    this.creditoService.removeCurrentCredit();
    this.clienteSvc.removeCurrentClient();
  }

  private ingresarPagoNoRealizado(): void {
    this.pagoSvc.setNopago()
      .subscribe({
        next: ({ message }) => {
          this.creditoService.removeCurrentCredit();
          this.notificacionesSvc.notificarPagoExitoso();
          this.confirmarEnvioComprobante(message);
        }
      });
  }

  private async confirmarEnvioComprobante(message: string): Promise<void> {
    await this.utilsSvc.presentAlert({
      header: 'Confirmacion',
      message: 'Desea enviar comprobante',
      mode: 'ios',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.cancelAction();
          }
        },
        {
          text: 'Si',
          handler: async () => {
            await this.utilsSvc.share({ title: 'No Pago', text: message });
          }
        }
      ]
    });
  }

  private async confirmarNoPagoCliente(cliente: Cliente): Promise<void> {
    await this.utilsSvc.presentAlert({
      header: 'Confirmacion',
      message: `Va a ingresar no pago a ${cliente.alias.toLowerCase()}`,
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => this.cancelAction()
        },
        {
          text: 'Confirmar',
          handler: () => this.ingresarPagoNoRealizado()
        }
      ]
    });
  }

}
