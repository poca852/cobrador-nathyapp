import { Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { FrecuenciaCobro, NuevoCredito } from 'src/app/models';
import { ClienteService } from 'src/app/services/cliente.service';
import { CreditoService } from 'src/app/services/credito.service';
import { UtilsService } from '../../../services/utils.service';
import { ManualCreditStrategy } from './helpers/manual-credit-strategy';
import { AutomaticCreditStrategy } from './helpers/automatic-credit-strategy';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-renovar',
  templateUrl: './renovar.page.html',
  styleUrls: ['./renovar.page.scss'],
})
export class RenovarPage {

  clienteServcie = inject(ClienteService);
  creditoService = inject(CreditoService);
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  appState = inject(AppStateService);

  cliente = computed(() => this.clienteServcie.currentClient());
  ngUnsubscribe = new Subject<void>();
  hoy = moment().utc(true).format('DD/MM/YYYY');

  imagesCliente = {
    document_image: this.cliente().document_image,
    business_image: this.cliente().business_image,
    house_image: this.cliente().house_image,
  }

  form = new FormGroup({
    valor_credito: new FormControl(null, [Validators.required]),
    interes: new FormControl(null, [Validators.required]),
    total_cuotas: new FormControl(null, [Validators.required]),
    notas: new FormControl(),
    valor_cuota: new FormControl({ value: null, disabled: true }),
    fecha_inicio: new FormControl(this.hoy, [Validators.required]),
    esAutomatico: new FormControl(true, [Validators.required]),
    frecuencia_cobro: new FormControl(FrecuenciaCobro.DIARIO, [Validators.required]),
    se_cobran_domingos: new FormControl(false, [Validators.required]),
    ruta: new FormControl(this.cliente().ruta, [Validators.required]),
    cliente: new FormControl(this.cliente()._id, [Validators.required]),
  });


  constructor() { 
  }

  ionViewWillEnter() {
    this.appState.setIsRenovando(true);
    this.setupFormValueChanges();
  }

  ionViewWillLeave() {
    this.appState.setIsRenovando(false);
    this.clienteServcie.removeCurrentClient();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public async takePicture(control: string) {

    try {

      const { dataUrl } = await this.utilsSvc.takePicture(`Selecciona / Toma una foto`);

      const loading = await this.utilsSvc.loading({ message: 'Subiendo imagen...' });
      await loading.present()

      let path: string = 'clientes';

      switch (control) {

        case 'document_image':
          path += `/documentos/${this.cliente()._id}`;
          break;

        case 'business_image':
          path += `/business/${this.cliente()._id}`;
          break;

        case 'house_image':
          path += `/house/${this.cliente()._id}`;
          break;

        default:
          break;
      }

      const urlImage = await this.firebaseSvc.uploadImage(path, dataUrl);
      this.imagesCliente[control] = urlImage;
      loading.dismiss();

    } catch (error) {

    }

  }

  onInputChange(event: any, control: FormControl): void {
    const newValue = event.target.value;
    if (newValue && typeof newValue === 'string') {
      const numericValue = parseFloat(newValue);

      if (!isNaN(numericValue)) {
        control.setValue(numericValue, { emitEvent: false });
      }
    }
  }


  private setupFormValueChanges(): void {
    this.form.get('esAutomatico')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((esAutomatico) => {
        const interesControl = this.form.get('interes');
        const valorCuotaControl = this.form.get('valor_cuota');

        if (esAutomatico) {
          interesControl?.enable();
          interesControl?.setValidators([Validators.required]);
          valorCuotaControl?.setValue(null);
          valorCuotaControl?.disable();
        } else {
          interesControl?.setValue(null);
          interesControl?.disable();
          valorCuotaControl?.enable();
          valorCuotaControl?.setValidators([Validators.required]);
        }

        interesControl?.updateValueAndValidity();
        valorCuotaControl?.updateValueAndValidity();
      });
  }

  public async presentConfirm(): Promise<void> {
    await this.utilsSvc.presentAlert({
      header: 'Confirmación',
      message: '¿Desea crear el crédito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Crear',
          handler: () => {
            this.renovar();
          },
        },
      ],
    });
  }


  async renovar(): Promise<void> {

    const creditStrategy = this.form.controls.esAutomatico.value
      ? new AutomaticCreditStrategy()
      : new ManualCreditStrategy();

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.creditoService.addCredito(creditStrategy.createCredit(this.form.value as NuevoCredito))
      .subscribe({
        next: async (credito) => {
          this.appState.setIsRenovando(false);
          this.clienteServcie.updateClient({
            ...this.imagesCliente,
          }).subscribe();

          await loading.dismiss();
          this.utilsSvc.routerLink('/main/rutero');
          this.utilsSvc.presentToast({
            message: 'Renovacion creada con éxito',
            color: 'primary',
            duration: 1000,
          });
        },
        error: async (err) => {
          this.appState.setIsRenovando(false);
          await loading.dismiss();
          await this.utilsSvc.presentAlert({
            header: 'Error al renovar el cliente',
            message: err.error.message,
            buttons: ['Ok'],
          });
        },
      });
  }

}
