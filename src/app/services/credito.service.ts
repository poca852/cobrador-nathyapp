import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { Credito, NuevoCredito, TipoDeCliente, User } from '../models';
import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';

interface GetCreditos {
  creditosVerificados: Credito[];
  creditosNoVerificados: Credito[];
}

@Injectable({
  providedIn: 'root'
})
export class CreditoService {

  utilsSvc = inject(UtilsService);
  http = inject(HttpClient);
  authService = inject(AuthService)

  public hoy = moment().utc(true).format("DD/MM/YYYY");
  private readonly baseUrl: string = environment.baseUrl;
  private _currentCredit = signal<Credito | null>(null);
  public currentCredit = computed(() => this._currentCredit());

  constructor() { }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  public setCurrentCredit(credit: Credito) {
    this._currentCredit.set(credit);
  }

  public removeCurrentCredit() {
    this._currentCredit.set(null);
  }

  getAllCreditos(): Observable<Credito[]> {

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.user().token}`);

    const params = new HttpParams()
      .append('ruta', this.user()!.ruta._id)

    return this.http.get<Credito[]>(`${this.baseUrl}/credito`, { headers, params })

  }

  updateCredit(idCredito: string, formData: any) {

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.user().token}`);

    return this.http.patch<Credito>(`${this.baseUrl}/credito/${idCredito}`, {...formData}, { headers })

  }

  getCreditos(): Observable<Credito[]> {

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.user().token}`);

    const params = new HttpParams()
      .append('ruta', this.user()!.ruta._id)

    return this.http.get<Credito[]>(`${this.baseUrl}/credito`, { headers, params })
      .pipe(
        map((creditos) => this.filtroDeCreditos(creditos))
      )
  }

  getCredito(id: string) {
    const headers = new HttpHeaders()
      .set('authorization', `Bearer ${localStorage.getItem('token')}`);

    return this.http.get<Credito>(`${this.baseUrl}/credito/${id}`, { headers })
      .pipe(
        map((credito) => this.agregarClasificacionAlCredito([credito])),
        map((creditos) => creditos[0]),
      )
  }

  addCredito(credito: NuevoCredito) {

    const headers = new HttpHeaders()
      .set('authorization', `Bearer ${this.user().token}`);
    return this.http.post<Credito>(`${this.baseUrl}/credito`, credito, { headers })
      .pipe(
        map((credito) => credito)
      )

  }

  // metodos del servicio
  // me devuelve los creditos en dos, verificados y no verificados, esto sirve para saber si van a aparecer en el rutero o verificados del menu
  filtroDeCreditos(creditos: Credito[]): Credito[] {

    let creditosFiltrados: Credito[] = [];

    this.agregarClasificacionAlCredito(creditos).forEach(credito => {

      if (!credito.ultimo_pago.includes(this.hoy) || !credito.ultimo_pago) {
        creditosFiltrados.unshift(credito);
      }

    });

    return creditosFiltrados;

  }

  // agregar clasificacion a los clientes

  agregarClasificacionAlCredito(creditos: Credito[]): Credito[] {

    let creditosClasificados: Credito[] = [];

    for (let i = 0; i < creditos.length; i++) {
      let creditoAClasificar: Credito = creditos[i];

      // creditos[i].clasificacion = this.clasificarCredito(creditos[i]);

      creditoAClasificar.clasificacion = this.clasificarCredito(creditoAClasificar);

      creditosClasificados.unshift(creditoAClasificar);
    }

    return creditosClasificados;
  }

  clasificarCredito(credito: Credito) {
    const estadoTipoClienteMap = {
      BUENO: TipoDeCliente.BUENO,
      MALO: TipoDeCliente.MALO,
      REGULAR: TipoDeCliente.REGULAR,
    };
  
    return estadoTipoClienteMap[credito.state] || TipoDeCliente.BUENO;

  }

}
