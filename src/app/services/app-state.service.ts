import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  private uploadingImage: boolean = false;

  private isMakingPayment: boolean = false;

  private isGettingPosition: boolean = false;

  private isRenovando: boolean = false;

  setUploadInProgress(uploading: boolean): void {
    this.uploadingImage = uploading;
  }

  isUploadInProgress(): boolean {
    return this.uploadingImage;
  }

  setIsMakingPayment(value: boolean): void {
    this.isMakingPayment = value;
  }

  getIsMakingPayment(): boolean {
    return this.isMakingPayment;
  }

  setIsGettingPosition(value: boolean): void {
    this.isGettingPosition = value;
  }

  getIsGettingPosition(): boolean {
    return this.isGettingPosition;
  }

  setIsRenovando(value: boolean): void {
    this.isRenovando = value;
  }

  getIsRenovando(): boolean {
    return this.isRenovando;
  }
  
}
