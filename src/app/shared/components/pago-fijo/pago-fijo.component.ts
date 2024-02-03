import { Component, EventEmitter, OnInit, Output, computed, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../services/utils.service';
import { CreditoService } from 'src/app/services/credito.service';

interface PagoFijo {
  cuota: number;
  valor: number;
}

@Component({
  selector: 'app-pago-fijo',
  templateUrl: './pago-fijo.component.html',
  styleUrls: ['./pago-fijo.component.scss'],
})
export class PagoFijoComponent implements OnInit {

  utilsSvc = inject(UtilsService);
  creditoSvc = inject(CreditoService);

  @Output()
  ammountEvent = new EventEmitter<number>();

  credito = computed(() => this.creditoSvc.currentCredit());
  ammount = new FormControl(null, Validators.required);
  numberOfCuotas: PagoFijo[] = [];

  constructor() { }

  ngOnInit() {
    this.numberOfCuotas = this.setNumberOfCuotas(this.credito().saldo, this.credito().valor_cuota)
  }

  public emitAmmount() {
    if (this.ammount.invalid) return;

    this.ammountEvent.emit(this.ammount.value);
    
    this.ammount.reset();
  }

  public setNumberOfCuotas(saldo: number, valor_cuota: number) {

    let arregloPagoFijo: PagoFijo[] = [];

    let cuotas = Math.floor(saldo / valor_cuota);

    for (let i = 1; i <= cuotas; i++) {

      arregloPagoFijo.push({
        cuota: i,
        valor: valor_cuota * i
      })

    }

    return arregloPagoFijo;

  }

}
