import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-pago-variable',
  templateUrl: './pago-variable.component.html',
  styleUrls: ['./pago-variable.component.scss'],
})
export class PagoVariableComponent implements OnInit {

  @Output()
  ammountVariableEvent = new EventEmitter<number>()

  @Input()
  loading: boolean = false;

  public ammount = new FormControl(null, Validators.required);

  constructor() { }

  ngOnInit() { }

  // convierte valores de tipo string a numero
  setNumberInputs() {
    let ammount = this.ammount;

    if(ammount.value) ammount.setValue(parseFloat(ammount.value));

  }

  public pagar() {
    if (this.ammount.invalid) return;
    this.ammountVariableEvent.emit(this.ammount.value);
    this.ammount.reset();
  }

}
