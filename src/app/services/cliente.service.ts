import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map, of } from 'rxjs';
import { Cliente, CreateCliente, Credito, User } from '../models';
import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private authService = inject(AuthService);
  private http = inject(HttpClient);
  utilsSvc = inject(UtilsService);

  private _currentClient = signal<Cliente | null>(null);
  public currentClient = computed(() => this._currentClient());

  private baseUrl: string = environment.baseUrl;

  constructor() { }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  addCliente(cliente: CreateCliente): Observable<Cliente> {

    cliente.ruta = this.user().ruta._id
    
    const headers = new HttpHeaders()
      .set("authorization", `Bearer ${this.user().token}`);

    return this.http.post<Cliente>(`${this.baseUrl}/cliente`, cliente, { headers })
      .pipe(
        map((cliente) => cliente)
      )
  }

  updateClient(formData: any) {

    const idClient = this.currentClient()?._id;

    const headers = new HttpHeaders()
      .append('authorization', `Bearer ${this.user().token}`)

    return this.http.patch<boolean>(`${this.baseUrl}/cliente/${idClient}`, formData, { headers })

  }

  getCliente(id: string, ruta: string) {
    const headers = new HttpHeaders()
      .set('authorization', `Bearer ${this.user().token}`);

    const params = new HttpParams()
      .append("ruta", ruta);

    return this.http.get<Cliente>(`${this.baseUrl}/cliente/${id}`, { headers, params });
  }

  getClientes(status: boolean): Observable<Cliente[]> {

    const headers = new HttpHeaders()
      .set('authorization', `Bearer ${this.user().token}`);

    const params = new HttpParams()
      .append('ruta', this.user().ruta._id)
      .append('status', status.toString());

    return this.http.get<Cliente[]>(`${this.baseUrl}/cliente`, { headers, params })
  }

  getClientesSinCredito(): Observable<Cliente[]> {

    const headers = new HttpHeaders()
      .set("authorization", `Bearer ${this.user().token}`);

    const params = new HttpParams()
      .set("idRuta", this.authService.currentUser()!.ruta._id)
      .set("status", false)

    return this.http.get<Cliente[]>(`${this.baseUrl}/cliente`, { headers, params })
      .pipe(
        map((clientes) => clientes)
      )
  }

  public updateCliente(cliente: Cliente) {
    const headers = new HttpHeaders()
      .set("authorization", `Bearer ${this.user().token}`)

    return this.http.patch<boolean>(`${this.baseUrl}/cliente/${cliente._id}`, cliente, { headers })
  }

  public getHistorialCliente(idCliente: string) {

    const headers = new HttpHeaders()
      .set('authorization', `Bearer ${this.user().token}`)

    return this.http.get<Credito[]>(`${this.baseUrl}/cliente/historial/${idCliente}`, { headers });

  }

  public setCurrentClient(cliente: Cliente) {
    this._currentClient.set(cliente);
  }

  public removeCurrentClient() {
    this._currentClient.set(null);
  }

  public llamarCliente() {
    const telefono = `tel:${this.currentClient()!.telefono}`;

    window.open(telefono, "_system")
  }
}
