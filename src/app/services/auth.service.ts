import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthStatus, LoginResponse, User } from '../models';
import { Observable, catchError, map, of } from 'rxjs';
import { UtilsService } from './utils.service';
import { NotificacionesService } from './notificaciones.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  utilsSvc = inject(UtilsService);
  notificacionesSvc = inject(NotificacionesService);

  private baseUrl: string = environment.baseUrl;
  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  private today = moment().utc(true).format('DD/MM/YYYY')

  private setAuthentication(user: User, token: string): boolean {

    if(user.rol !== 'COBRADOR') return false;

    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    this.utilsSvc.saveInLocalStorage('user', {...user, token});
    return true;
  }

  login(username: string, password: string): Observable<boolean> {
    const url: string = `${this.baseUrl}/auth/login`;
    const body = {username, password};

    const params = new HttpParams()
      .append('fecha', this.today)

    return this.http.post<LoginResponse>(url, body, {params})
      .pipe(
        map(({user, token}) => this.setAuthentication(user, token))
      )
  }

  revalidarToken(): Observable<boolean>{

    const url: string = `${this.baseUrl}/auth/revalidar`;
    const user = this.utilsSvc.getFromLocalStorage('user');
    if(!user){
      this._authStatus.set(AuthStatus.noAuthenticated);
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('authorization', `Bearer ${user.token}`)

    return this.http.get<LoginResponse>(url, {headers})
      .pipe(
        map(({user, token}) => this.setAuthentication(user, token)),
        catchError((err) => {
          this._authStatus.set(AuthStatus.noAuthenticated);
          return of(false)
        })
      )
  }

  logout(){
    this.notificacionesSvc.notificarLogout();
    this._authStatus.set(AuthStatus.noAuthenticated);
    this._currentUser.set(null);
    localStorage.removeItem('user');
  }



}
