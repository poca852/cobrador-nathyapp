import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { CreditoService } from '../../../services/credito.service';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-info-cliente',
  templateUrl: './info-cliente.page.html',
  styleUrls: ['./info-cliente.page.scss'],
})
export class InfoClientePage {

  utilsSvc = inject(UtilsService);
  creditoSvc = inject(CreditoService);
  clienteSvc = inject(ClienteService);

  cliente = computed(() => this.clienteSvc.currentClient());
  credito = computed(() => this.creditoSvc.currentCredit());

  constructor() { }

  ionViewWillLeave() {
    this.creditoSvc.removeCurrentCredit();
    this.clienteSvc.removeCurrentClient();
  }

  ionViewWillEnter() {}

  public llamarCliente() {
    this.clienteSvc.llamarCliente();
  }

}
