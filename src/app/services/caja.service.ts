import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';
import { Caja, User } from '../models';
import { MomentService } from './moment.service';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  http = inject(HttpClient);
  authService = inject(AuthService);
  utilsSvc = inject(UtilsService);
  momentSvc = inject(MomentService);

  private readonly baseUrl: string = environment.baseUrl;
  private hoy: string = moment().utc(true).format("YYYY-MM-DD")

  constructor() { }

  get user(): User {
    return this.utilsSvc.getFromLocalStorage('user') as User;
  }

  getCaja(){

    const headers = new HttpHeaders()
      .set('authorization', `Bearer ${this.user.token}`);

    const params = new HttpParams()
      .append('ruta', this.user.ruta._id)
      .append('fecha', this.hoy)

    return this.http.get<Caja>(`${this.baseUrl}/caja/current`, { headers, params })

  }

  closeRuta() {

    let ruta = this.user.ruta._id;
    const url = `${this.baseUrl}/ruta/close/${ruta}`;

    const headers = new HttpHeaders()
      .set('authorization', `Bearer ${this.user.token}`);

    const params = new HttpParams()
      .set('fecha', this.momentSvc.nowWithFormat('DD/MM/YYYY'))

    return this.http.patch<boolean>(url, {}, { headers, params });
  }

}
