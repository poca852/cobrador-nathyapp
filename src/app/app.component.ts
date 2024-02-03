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
    App.getLaunchUrl().then(resp => {
      console.log(resp.url)
    })
    .catch(err => console.log(err))

    this.initialApp();
    
  }

  private async checkPermissions() {

    if(this.platform.is('hybrid')){
      const permission = await Geolocation.checkPermissions();
      if (permission.location === 'prompt') {
        await Geolocation.requestPermissions();
      }
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
