import { Component, OnInit, computed, inject } from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { CreditoService } from '../../../services/credito.service';
import { PagosService } from '../../../services/pagos.service';

@Component({
  selector: 'app-historial-pagos',
  templateUrl: './historial-pagos.page.html',
  styleUrls: ['./historial-pagos.page.scss'],
})
export class HistorialPagosPage implements OnInit {

  clienteSvc = inject(ClienteService);
  creditoSvc = inject(CreditoService);
  pagoSvc = inject(PagosService);

  pagos = computed(() => this.creditoSvc.currentCredit().pagos);
  cliente = computed(() => this.clienteSvc.currentClient());

  constructor() { }

  ngOnInit() {
  }

}
