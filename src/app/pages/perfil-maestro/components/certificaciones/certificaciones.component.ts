import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonIcon,
  IonCheckbox,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  ribbonOutline,
  calendarOutline,
  addCircleOutline,
  trashOutline,
} from 'ionicons/icons';
import { StorageService } from '../../../../services/storage';

export interface Certificacion {
  nombre:           string;
  fechaObtencion:   string;
  vence:            boolean;
  fechaVencimiento: string;
}

@Component({
  selector: 'app-certificaciones',
  templateUrl: './certificaciones.component.html',
  styleUrls: ['./certificaciones.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonIcon,
    IonCheckbox,
  ],
})
export class CertificacionesComponent {

  lista: Certificacion[] = [];
  nueva: Certificacion   = this.certVacia();

  constructor(
    private storage: StorageService,
    private toast:   ToastController,
  ) {
    addIcons({ ribbonOutline, calendarOutline, addCircleOutline, trashOutline });
    this.cargar();
  }

  certVacia(): Certificacion {
    return {
      nombre:           '',
      fechaObtencion:   '',
      vence:            false,
      fechaVencimiento: '',
    };
  }

  async cargar(): Promise<void> {
    const guardado = await this.storage.get('tud_certificaciones');
    if (guardado) {
      this.lista = JSON.parse(guardado);
    }
  }

  async agregar(): Promise<void> {
    if (!this.nueva.nombre || !this.nueva.fechaObtencion) {
      this.mostrarToast('Completa nombre y fecha de obtención');
      return;
    }
    if (this.nueva.vence && !this.nueva.fechaVencimiento) {
      this.mostrarToast('Ingresa la fecha de vencimiento');
      return;
    }
    if (!this.nueva.vence) {
      this.nueva.fechaVencimiento = '';
    }
    this.lista.push({ ...this.nueva });
    this.storage.set('tud_certificaciones', JSON.stringify(this.lista));
    this.nueva = this.certVacia();
    this.mostrarToast('Certificación agregada');
  }

  async eliminar(index: number): Promise<void> {
    this.lista.splice(index, 1);
    this.storage.set('tud_certificaciones', JSON.stringify(this.lista));
    this.mostrarToast('Certificación eliminada');
  }

  private async mostrarToast(msg: string): Promise<void> {
    const t = await this.toast.create({
      message:  msg,
      duration: 2000,
      position: 'bottom',
    });
    await t.present();
  }
}