import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private pagoExitoso = new Subject<void>();
  private updatePago = new Subject<void>();
  private logOut = new Subject<void>();

  pagoExitoso$ = this.pagoExitoso.asObservable();
  updatePago$ = this.updatePago.asObservable();
  logOut$ = this.logOut.asObservable();

  notificarPagoExitoso() {
    this.pagoExitoso.next();
  }

  notificarUpdatePago(){
    this.updatePago.next();
  }

  notificarLogout() {
    this.logOut.next();
  }
}
