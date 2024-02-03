import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListaDeGastos } from 'src/app/models';
import { OficinaService } from 'src/app/services/oficina.service';
import { UtilsService } from '../../../services/utils.service';
import { NewGasto } from '../../../models/gasto.interface';

@Component({
  selector: 'app-gasto-oficina',
  templateUrl: './gasto-oficina.component.html',
  styleUrls: ['./gasto-oficina.component.scss'],
})
export class GastoOficinaComponent implements OnInit, OnDestroy {

  oficinaSvc = inject(OficinaService);
  utilsSvc = inject(UtilsService);

  public listOfGasto: ListaDeGastos[] = []

  public form = new FormGroup({
    valor: new FormControl(null, [Validators.required]),
    nota: new FormControl(),
    gasto: new FormControl('', [Validators.required])
  })

  constructor() { }


  ngOnDestroy(): void {
    this.form.reset();
  }

  ngOnInit(): void {
    this.getListOfGastos();
  }

  getListOfGastos() {
    this.oficinaSvc.getListaGastos()
      .subscribe({
        next: gastos => {
          this.listOfGasto = gastos
        }
      })
  }

  public async showConfirm(){
    await this.utilsSvc.presentAlert({
      header: 'Confirmacion',
      message: '¿Desea agregar este gasto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: async () => {
            const loading = await this.utilsSvc.loading();
            await loading.present();
            this.addGasto(loading);
          }
        }
      ]
    })
  }

  public addGasto(loading: HTMLIonLoadingElement) {

    this.oficinaSvc.addGasto(this.form.value as NewGasto)
      .subscribe({
        next: () => {
          this.ngOnDestroy();
          this.utilsSvc.routerLink("/main/caja")
          loading.dismiss();
        },
        error: (err) => {

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
