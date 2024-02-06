import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { CreditoService } from './credito.service';
import { AuthService } from './auth.service';
import { Credito, Pago, PagoResponse, User } from '../models';
import { CrearPago } from '../helpers/crearPago';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  private http = inject(HttpClient)
  private authServcie = inject(AuthService)
  private creditoService = inject(CreditoService);
  utilsSvc = inject(UtilsService);

  private readonly baseUrl: string = environment.baseUrl;

  public hoy = moment().utc(true).format("DD/MM/YYYY");

  constructor() { }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  addPago(pago: CrearPago) {
    const headers = new HttpHeaders()
      .set('authorization', `Bearer ${this.user().token}`);

    const params = new HttpParams()
      .set('fecha', moment().utc(true).format())

    return this.http.post<PagoResponse>(`${this.baseUrl}/pago`, pago, { headers, params })
  }

  getPagos() {

    const headers = new HttpHeaders()
      .set('authorization', `Bearer ${this.user().token}`);

    const params = new HttpParams()
      .append("ruta", this.authServcie.currentUser()!.ruta._id)
      .append("fecha", this.hoy)

    return this.http.get<Pago[]>(`${this.baseUrl}/pago`, { headers, params })

  }

  updatePago(valor: number, idPago: string) {

    const formData = {
      valor
    }

    const headers = new HttpHeaders()
      .set('authorization', `Bearer ${this.user().token}`);

    return this.http.patch<boolean>(`${this.baseUrl}/pago/${idPago}`, formData, { headers })

  }

  getPago(id: string) {
    const headers = new HttpHeaders()
      .set('authorization', `Bearer ${this.user().token}`);

    return this.http.get<Pago>(`${this.baseUrl}/pago/${id}`, { headers })
  }

  public setNopago() {

    const creditActual: Credito = this.creditoService.currentCredit() as Credito;

    const pago = new CrearPago(creditActual, 0);

    return this.addPago(pago);

  }


}
