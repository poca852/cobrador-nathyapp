import { Component } from '@angular/core';

enum Gestion {
  GASTO ='gasto',
  INVERSION ='inversion',
  RETIRO = 'retiro'
}

@Component({
  selector: 'app-oficina',
  templateUrl: './oficina.page.html',
  styleUrls: ['./oficina.page.scss'],
})
export class OficinaPage {

  public loading: boolean = true;
  public tipeOfGestion = Gestion.GASTO;

  constructor() { }

  ionViewWillEnter() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  ionViewWillLeave() {
    this.tipeOfGestion = Gestion.GASTO;
  }

  public setTipeOfGestion(ev: any){
    this.tipeOfGestion = ev.target.value as Gestion;
  }

}
