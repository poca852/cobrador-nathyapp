import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { CreditoService } from '../../../services/credito.service';
import { ClienteService } from '../../../services/cliente.service';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-info-cliente',
  templateUrl: './info-cliente.page.html',
  styleUrls: ['./info-cliente.page.scss'],
})
export class InfoClientePage {

  utilsSvc = inject(UtilsService);
  creditoSvc = inject(CreditoService);
  clienteSvc = inject(ClienteService);
  appStateSvc = inject(AppStateService);

  cliente = computed(() => this.clienteSvc.currentClient());
  credito = computed(() => this.creditoSvc.currentCredit());

  constructor() { }

  ionViewWillLeave() {
    this.creditoSvc.removeCurrentCredit();
    this.clienteSvc.removeCurrentClient();
  }

  ionViewWillEnter() {}

  public llamarCliente() {
    this.clienteSvc.llamarCliente();
  }

  public async getLocation() {

    const loading = await this.utilsSvc.loading({
      message: 'Obteniendo Ubicacion, por favor espere...'
    })
    loading.present();

    navigator.geolocation.getCurrentPosition(
      (position) => {        
        const ubication = [position.coords.longitude, position.coords.latitude];

        this.clienteSvc.updateClient({ubication}).subscribe({
          next: (value) => {
            loading.dismiss()

            if(value) {
              this.utilsSvc.presentToast({
                duration: 3000,
                color: 'success',
                icon: 'locate-outline',
                message: 'Ubicacion actualizada'
              })
            }

          },
          error: () => {
            loading.dismiss()
          }
        })

      },
      (error) => {
        loading.dismiss()
      }, 
      {enableHighAccuracy: true}
    )

  }

}
