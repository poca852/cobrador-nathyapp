import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../services/utils.service';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/models';
import { CreditoService } from '../../services/credito.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    { title: 'Rutero', url: '/main/rutero', icon: 'git-network-outline' },
    { title: 'Verificados', url: '/main/verificados', icon: 'checkmark-done-outline' },
    { title: 'Renovaciones', url: '/main/renovaciones', icon: 'refresh-outline' },
    { title: 'Cliente Nuevo', url: '/main/cliente-nuevo', icon: 'person-add-outline' },
    { title: 'Oficina', url: '/main/oficina', icon: 'bag-outline' },
    { title: 'Caja', url: '/main/caja', icon: 'analytics-outline' },
    { title: 'Enrutador', url: '/main/enrutador', icon: 'document-text-outline' },
  ]

  utilsSvc = inject(UtilsService);
  authSvc = inject(AuthService)
  router = inject(Router);
  creditoSvc = inject(CreditoService);
  currentPath: string = '';

  ngOnInit() {
    this.router.events.subscribe((event: any) => {

      if(event?.url) this.currentPath = event.url;

    })
  }

  ionViewWillLeave() {
    // this.creditoSvc.
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  signOut() {
    this.authSvc.logout();
    this.utilsSvc.routerLink('/auth')
  }

}
