import { Component, OnInit, inject, computed, Input } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Credito } from '../../../models/credito.interface';
import { Cliente } from 'src/app/models';
import { getDiasDeAtraso } from './helpers/getDiasDeAtraso';

@Component({
  selector: 'app-historial-creditos',
  templateUrl: './historial-creditos.component.html',
  styleUrls: ['./historial-creditos.component.scss'],
})
export class HistorialCreditosComponent implements OnInit {

  @Input() cliente: Cliente;

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  clienteSvc = inject(ClienteService);

  ultimos5Creditos: Credito[] = [];

  constructor() { }

  ngOnInit() {
    this.getHistorialCreditos();
  }

  getHistorialCreditos() {
    this.clienteSvc.getHistorialCliente(this.cliente._id)
      .subscribe({
        next: creditos => {
          this.ultimos5Creditos = this.setDiasDeAtrasoToCredits(creditos.slice(0, 5));
        }
      })
  }

  private setDiasDeAtrasoToCredits(creditos: Credito[]) {

    for (const credito of creditos) {
      credito.dias_transcurridos = getDiasDeAtraso(credito);
    }

    return creditos;

  }

}
