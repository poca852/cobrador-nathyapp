import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import * as moment from 'moment';
import { UtilsService } from './utils.service';
import { AuthService } from './auth.service';
import { Inversion, ListaDeGastos, NewGasto, Retiro, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OficinaService {

  utilsSvc = inject(UtilsService);
  authSvc = inject(AuthService);
  http = inject(HttpClient);

  private readonly baseUrl: string = environment.baseUrl;
  private hoy = moment().utc(true).toISOString();
  
  constructor() { }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }
 
  getListaGastos(): Observable<ListaDeGastos[]> {
    const headers = new HttpHeaders()
      .set('authorization',  `Bearer ${this.user().token}`);

    return this.http.get<ListaDeGastos[]>(`${this.baseUrl}/list-gasto`, { headers })
  }

  addGasto(gasto: NewGasto) {

    gasto.ruta = this.user().ruta._id;
    gasto.fecha = this.hoy;

    const headers = new HttpHeaders()
      .set('authorization', `Bearer ${this.user().token}`);

    return this.http.post<boolean>(`${this.baseUrl}/gasto`, gasto, { headers })
  
  }

  addInversion(inversion: Inversion) {
    inversion.ruta = this.user().ruta._id as string;
    const headers = new HttpHeaders()
      .set('authorization', `Bearer ${this.user().token}`);

    return this.http.post<Inversion>(`${this.baseUrl}/inversion`, inversion, { headers })
      .pipe(
        map((inversion) => true),
      )
  }

  addRetiro(retiro: Retiro) {

    retiro.ruta = this.user().ruta._id as string;

    const headers = new HttpHeaders()
      .set('authorization', `Bearer ${this.user().token}`);

    return this.http.post<Retiro>(`${this.baseUrl}/retiro`, retiro, { headers })
      .pipe(
        map(credito => true)
      )
  }
}
