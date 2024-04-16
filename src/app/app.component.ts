import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { App, AppState } from '@capacitor/app';
import { UtilsService } from './services/utils.service';
import { WsService } from './services/ws-service.service';
import { AuthService } from './services/auth.service';
import { AppStateService } from './services/app-state.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private platform: Platform,
    private utilsSvc: UtilsService,
    private wsSvc: WsService,
    private authSvc: AuthService,
    private appStateSvc: AppStateService,
  ) {

    this.checkPermissions();
    this.initialApp();
    
  }

  ngOnInit(): void {
    this.wsSvc.listen('close-caja').subscribe(({ruta}) => {
      if(this.utilsSvc.getFromLocalStorage('user').ruta._id === ruta){
        this.utilsSvc.routerLink('calculator')
        this.authSvc.logout();
      }
    })
  }

  private async checkPermissions() {
    
    const permission = await Geolocation.checkPermissions();
    if (permission.location !== 'granted') {

      navigator.geolocation.getCurrentPosition(
        (position) => {},
        (error) => {

          this.utilsSvc.presentAlert({
            header: 'Advertencia',
            message: 'Por favor active la ubicacion',
            buttons: ['OK']
          })

        })
      
    }
    
  }

  initialApp() {
    App.addListener('appStateChange', (state: AppState) => {
      if( !state.isActive && !this.appStateSvc.getIsMakingPayment() ){

        if( !this.appStateSvc.getIsRenovando() && this.utilsSvc.getFromLocalStorage('user').ruta.have_login_falso ) {

          if( !!this.utilsSvc.getFromLocalStorage('user') ){
            this.utilsSvc.routerLink('calculator')
          }

        }


      }

    })
  }
}
