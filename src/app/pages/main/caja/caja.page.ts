import { Component, OnInit, inject } from '@angular/core';
import { Caja } from 'src/app/models';
import { AuthService } from 'src/app/services/auth.service';
import { CajaService } from 'src/app/services/caja.service';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.page.html',
  styleUrls: ['./caja.page.scss'],
})
export class CajaPage implements OnInit {

  private cajaService = inject(CajaService);
  private authService = inject(AuthService);
  utilsSvc = inject(UtilsService);

  public loading: boolean = true;
  public caja: Caja | null = null;

  constructor(

  ) { }

  ionViewWillEnter() {
    this.getCaja();
  }

  ngOnInit() {}

  private getCaja() {
    this.cajaService.getCaja()
      .subscribe({
        next: caja => {
          this.caja = caja;
          this.loading = false;
        }
      })
  }

  public async showConfirm() {
    await this.utilsSvc.presentAlert({
      header: 'Confirmacion',
      message: '¿Desea cerrar la ruta?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Si, Cerrar',
          handler: async () => {
            let loading = await this.utilsSvc.loading();
            await loading.present();
            this.cerrarRuta(loading);
          }
        }
      ]
    })

  }

  public cerrarRuta(loading: HTMLIonLoadingElement) {
    this.cajaService.closeRuta()
      .subscribe({
        next: async (seCerro) => {

          this.utilsSvc.routerLink('/auth');
          this.authService.logout();
          loading.dismiss();

          await this.utilsSvc.presentToast({
            message: 'Ruta Cerrada',
            position: 'middle',
            duration: 1000
          })
        }
      })
  }

  private generarReporte(): string {

    return `Ruta: ${this.caja?.ruta?.nombre}
      Fecha: ${this.caja?.fecha}
      Base: $.${this.caja?.base.toFixed(2)}
      Inversion: $.${this.caja?.inversion.toFixed(2)}
      Retiro: $.${this.caja?.retiro.toFixed(2)}
      Gasto: $.${this.caja?.gasto.toFixed(2)}
      Pretendido: $.${this.caja?.pretendido.toFixed(2)}
      Extra: $.${this.caja?.extra.toFixed(2)}
      Cobro: $.${this.caja?.cobro.toFixed(2)}
      Prestamo: $.${this.caja?.prestamo.toFixed(2)}
      Clientes: ${this.caja?.total_clientes}
      Caja Final: $.${this.caja?.caja_final.toFixed(2)}
    `

  }

  public async shareCaja() {
    this.utilsSvc.share({
      title: 'Reporte de Caja',
      text: this.generarReporte(),
      dialogTitle: 'Reporte de Caja',
    })
  }

}
