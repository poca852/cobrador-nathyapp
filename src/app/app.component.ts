import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { App, AppState } from '@capacitor/app';
import { UtilsService } from './services/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private utilsSvc: UtilsService,
  ) {

    this.checkPermissions();
    this.initialApp();
    
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
      if(!state.isActive){
        this.utilsSvc.routerLink('calculator')
      }
    })
  }
}
