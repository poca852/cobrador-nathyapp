import { Component, OnInit, inject } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { ClienteService } from '../../../services/cliente.service';
import { CreditoService } from '../../../services/credito.service';
import { Credito } from '../../../models/credito.interface';
import { Cliente } from '../../../models/cliente.interface';
import { ItemReorderEventDetail } from '@ionic/angular';

@Component({
  selector: 'app-enrutador',
  templateUrl: './enrutador.page.html',
  styleUrls: ['./enrutador.page.scss'],
})
export class EnrutadorPage implements OnInit {

  utilsSvc = inject(UtilsService);
  clienteSvc = inject(ClienteService);
  creditoSvc = inject(CreditoService);

  creditos: Credito[];

  constructor() { }

  ngOnInit() {
    this.creditoSvc.getAllCreditos().subscribe((creditos) => {
      this.creditos = creditos;
    })
  }

  async reorderItems(ev: CustomEvent<ItemReorderEventDetail>) {

    // Obtén el nuevo orden de los elementos reordenados
    const nuevoOrden = ev.detail.complete(this.creditos);

    // Actualiza los turnos en función del nuevo orden
    nuevoOrden.forEach((credito, nuevoIndice) => {
      // El nuevo turno será el nuevo índice más 1
      const nuevoTurno = nuevoIndice + 1;

      // Actualiza el turno en el objeto credito
      credito.turno = nuevoTurno;

      // Llama al servicio para actualizar el turno en la base de datos
      this.creditoSvc.updateCredit(credito._id, { turno: nuevoTurno }).subscribe();
    });

    // Completa la reordenación
    ev.detail.complete();

  }


}
