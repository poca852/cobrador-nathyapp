import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { OficinaService } from 'src/app/services/oficina.service';
import { UtilsService } from '../../../services/utils.service';
import { Inversion } from '../../../models';

@Component({
  selector: 'app-inversion-oficina',
  templateUrl: './inversion-oficina.component.html',
  styleUrls: ['./inversion-oficina.component.scss'],
})
export class InversionOficinaComponent implements OnInit {

  oficinaService = inject(OficinaService);
  utilsSvc = inject(UtilsService);

  private hoy: string = moment().utc(true).format('DD/MM/YYYY');

  public form = new FormGroup({
    valor: new FormControl(null, [Validators.required]),
    fecha: new FormControl(this.hoy, [Validators.required]),
    nota: new FormControl()
  })

  constructor() { }

  ngOnDestroy(): void {
    this.form.reset();
  }

  ngOnInit() {

  }

  public async showConfirm() {
    await this.utilsSvc.presentAlert({
      header: 'Confirmacion',
      mode: 'ios',
      message: '¿Desea agregar esta Inversion?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: async () => {
            let loading = await this.utilsSvc.loading();
            await loading.present();
            this.addInversion(loading);
          }
        }
      ]
    })
  }

  private addInversion(loading: HTMLIonLoadingElement) {
    this.oficinaService.addInversion(this.form.value as Inversion)
      .subscribe({
        next: (isAdd) => {
          this.ngOnDestroy();
          this.utilsSvc.routerLink('/main/caja');
          loading.dismiss();
        },
        error: err => {
          let header = 'Error al ingresar el gasto';

          this.utilsSvc.presentAlert({
            header,
            message: err.error.message,
            mode: 'ios',
            buttons: ['Ok']
          })

          loading.dismiss();
        }
      })
  }

}
