import { Component, Input, OnInit } from '@angular/core';
import { Cliente, Pago } from 'src/app/models';

@Component({
  selector: 'app-pago-historial',
  templateUrl: './pago-historial.component.html',
  styleUrls: ['./pago-historial.component.scss'],
})
export class PagoHistorialComponent  implements OnInit {

  @Input() pagos: Pago[] = []

  @Input() cliente: Cliente;

  constructor() { }

  ngOnInit() {}

}
