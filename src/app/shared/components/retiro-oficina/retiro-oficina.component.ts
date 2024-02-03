import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Retiro } from 'src/app/models';
import { OficinaService } from 'src/app/services/oficina.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-retiro-oficina',
  templateUrl: './retiro-oficina.component.html',
  styleUrls: ['./retiro-oficina.component.scss'],
})
export class RetiroOficinaComponent implements OnInit, OnDestroy {

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
      message: '¿Desea agregar este retiro?',
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
            this.addRetiro(loading);
          }
        }
      ]
    })
  }

  private addRetiro(loading: HTMLIonLoadingElement) {
    this.oficinaService.addRetiro(this.form.value as Retiro)
      .subscribe({
        next: (isAdd) => {
          this.ngOnDestroy();
          this.utilsSvc.routerLink('/main/caja');
          loading.dismiss();
        },
        error: err => {
          let header = 'Error al ingresar el Retiro';

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
