import { Component, inject } from '@angular/core';
import { Cliente } from 'src/app/models';
import { ClienteService } from 'src/app/services/cliente.service';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-renovaciones',
  templateUrl: './renovaciones.page.html',
  styleUrls: ['./renovaciones.page.scss'],
})
export class RenovacionesPage {

  clienteService = inject(ClienteService);
  utilsSvc = inject(UtilsService);

  public loading: boolean = true;
  private clientes: Cliente[] = [];
  public clientesFiltrados: Cliente[] = [];

  constructor() { }

  ionViewWillEnter() {
    this.getClientes();
  }

  doRefresh(event: any) {    
    this.loading = true;
    setTimeout(() => {
      this.getClientes()
      event.target.complete();
    }, 1000);
  }

  async presentActionSheet(cliente: Cliente) {

    this.clienteService.setCurrentClient(cliente);

    await this.utilsSvc.presentActionSheet({
      header: `Acciones para ${cliente.alias.toLowerCase()}`,
      mode: 'ios',
      buttons: [
        {
          text: 'Renovar',
          handler: () => {
            this.utilsSvc.routerLink(`/main/renovar`)
          }
        },
        {
          text: 'Informacion del Cliente',
          handler: () => {
            this.utilsSvc.routerLink('/main/info-cliente')
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.clienteService.removeCurrentClient();
          } 
        },
      ],
    });
  }

  public filtrarClientes(termino: string) {
    
    if(termino === ''){
      this.clientesFiltrados = [...this.clientes];
    }

    const normalizedQuery = termino.toLowerCase();
    this.clientesFiltrados = this.clientes.filter((item) => {
      return item.alias.toLowerCase().includes(normalizedQuery);
    });

  }

  getClientes() {
    this.clienteService.getClientesSinCredito()
      .subscribe({
        next: clientes => {
          this.clientes = clientes;
          this.clientesFiltrados = [...clientes];
          this.loading = false;
        }
      })
  }

}
