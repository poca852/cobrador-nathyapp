import { Component, OnInit, computed, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/services/cliente.service';
import { CreditoService } from 'src/app/services/credito.service';
import { PagosService } from 'src/app/services/pagos.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-update-pago',
  templateUrl: './update-pago.page.html',
  styleUrls: ['./update-pago.page.scss'],
})
export class UpdatePagoPage implements OnInit {

  clienteService = inject(ClienteService);
  creditoService = inject(CreditoService);
  pagoService = inject(PagosService);
  comunicacionService = inject(NotificacionesService);
  utilsSvc = inject(UtilsService);

  public cliente = computed(() => this.clienteService.currentClient());
  public credito = computed(() => this.creditoService.currentCredit());
  public control = new FormControl(null, Validators.required);

  constructor() { }

  ngOnInit() {}

  setNumberInputs() {
    let control = this.control;

    if(control.value) control.setValue(parseFloat(control.value));

  }

  private updatePago() {
    this.pagoService.updatePago(this.control.value, this.credito().pagos[0]._id as string)
      .subscribe({
        next: (seActualizo) => {
          this.comunicacionService.notificarUpdatePago();
          this.utilsSvc.routerLink('/main/verificados')
        },
        error: (err) => {
          this.utilsSvc.presentToast({
            message: err.error.message,
            mode: 'ios',
            duration: 1500,
            position: 'middle',
            color: 'warning'
          })
          this.control.setValue(null);
        }
      })
  }


  public async showConfirmationUpdatePago() {

    await this.utilsSvc.presentAlert({
      header: 'Confirmacion',
      message: 'Desea actualizar este pago?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Actualizar',
          handler: () => {
            this.updatePago()
          }
        }
      ]
    })

  }

}
