import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models';
import { ClienteService } from '../../../services/cliente.service';
import { UtilsService } from '../../../services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-cliente-nuevo',
  templateUrl: './cliente-nuevo.page.html',
  styleUrls: ['./cliente-nuevo.page.scss'],
})
export class ClienteNuevoPage {

  clienteSvc = inject(ClienteService);
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  http = inject(HttpClient);

  form = new FormGroup({
    dpi: new FormControl(null, [Validators.required, Validators.min(5)]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(4)]),
    alias: new FormControl('', [Validators.required, Validators.minLength(3)]),
    ciudad: new FormControl('', [Validators.required, Validators.minLength(3)]),
    direccion: new FormControl('', [Validators.required, Validators.minLength(5)]),
    telefono: new FormControl('', [Validators.required]),
    document_image: new FormControl('', [Validators.required]),
    business_image: new FormControl(''),
    house_image: new FormControl(''),
    ubication: new FormControl([])
  })

  constructor() { }

  ionViewWillEnter() {
  }

  ionViewWillLeave() {
    this.form.reset();
  }

  // async getCurrentPosition(): Promise<[number, number]> {
  //   return this.utilsSvc.getCurrentPosition();
  // }

  setNumberInputs() {

    let { dpi } = this.form.controls;

    if (dpi.value) dpi.setValue(`${dpi.value}`);

  }

  public async takePicture(control: string) {
    
    if (!this.form.controls.dpi.value) {

      this.form.controls.dpi.markAsTouched({
        onlySelf: true
      })
      return;

    }

    try {


      const { dataUrl } = await this.utilsSvc.takePicture(`Selecciona / Toma una foto`);

      let path: string = 'clientes';

      switch (control) {
        case 'document_image':
          path += `/documentos/${this.form.controls.dpi.value}`;
          break;

        case 'business_image':
          path += `/business/${this.form.controls.dpi.value}`;
          break;

        case 'house_image':
          path += `/house/${this.form.controls.dpi.value}`;
          break;

        default:
          break;
      }

      const urlImage = await this.firebaseSvc.uploadImage(path, dataUrl);
      const loading = await this.utilsSvc.loading({ message: 'Subiendo imagen...' });
      await loading.present()
      this.form.get(control).setValue(urlImage);
      loading.dismiss();

    } catch (error) {
  

        
    }


  }

  public async submit() {

    if (this.form.valid) {

      // this.form.controls.ubication.setValue(await this.getCurrentPosition());

      let loading = await this.utilsSvc.loading({
        message: 'Creando cliente...'
      });
      await loading.present();

      this.clienteSvc.addCliente(this.form.value as Cliente)
        .subscribe({
          next: (cliente) => {
            this.clienteSvc.setCurrentClient(cliente);
            this.utilsSvc.routerLink('/main/renovar')
            loading.dismiss();
          },
          error: err => {
            loading.dismiss();

            let mensaje: string = 'Ocurrio un problema con el servidor por favor hable con el administrador';
            if (err.status === 400) {
              if (Array.isArray(err.error.message)) {
                mensaje = err.error.message[0]
              } else {
                mensaje = err.error.message
              }
            }
            this.showAlert('Error al crear un cliente', mensaje);
          }
        })

    }

  }

  private async showAlert(titulo: string, mensaje: string) {

    await this.utilsSvc.presentAlert({
      header: titulo,
      message: mensaje,
      buttons: ['Ok'],
    })

  }

}
