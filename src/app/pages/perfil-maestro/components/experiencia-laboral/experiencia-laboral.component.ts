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
  briefcaseOutline,
  calendarOutline,
  addCircleOutline,
  saveOutline,
  trashOutline,
} from 'ionicons/icons';
import { StorageService } from '../../../../services/storage';

export interface Experiencia {
  empresa:       string;
  cargo:         string;
  anioInicio:    number | null;
  trabajaActual: boolean;
  anioTermino:   number | null;
}

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonIcon,
    IonCheckbox,
  ],
})
export class ExperienciaLaboralComponent {

  lista: Experiencia[] = [];
  nueva: Experiencia   = this.experienciaVacia();

  constructor(
    private storage: StorageService,
    private toast:   ToastController,
  ) {
    addIcons({ briefcaseOutline, calendarOutline, addCircleOutline, saveOutline, trashOutline });
    this.cargar();
  }

  experienciaVacia(): Experiencia {
    return {
      empresa:       '',
      cargo:         '',
      anioInicio:    null,
      trabajaActual: false,
      anioTermino:   null,
    };
  }

  async cargar(): Promise<void> {
    const guardado = await this.storage.get('tud_experiencias');
    if (guardado) {
      this.lista = JSON.parse(guardado);
    }
  }

  async agregar(): Promise<void> {
    if (!this.nueva.empresa || !this.nueva.cargo || !this.nueva.anioInicio) {
      this.mostrarToast('Completa empresa, cargo y año inicio');
      return;
    }
    if (!this.nueva.trabajaActual && !this.nueva.anioTermino) {
      this.mostrarToast('Ingresa el año de término');
      return;
    }
    if (this.nueva.trabajaActual) {
      this.nueva.anioTermino = null;
    }
    this.lista.push({ ...this.nueva });
    this.storage.set('tud_experiencias', JSON.stringify(this.lista));
    this.nueva = this.experienciaVacia();
    this.mostrarToast('Experiencia agregada');
  }

  async eliminar(index: number): Promise<void> {
    this.lista.splice(index, 1);
    this.storage.set('tud_experiencias', JSON.stringify(this.lista));
    this.mostrarToast('Experiencia eliminada');
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