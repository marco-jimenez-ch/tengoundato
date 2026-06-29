import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  callOutline,
  constructOutline,
  saveOutline,
} from 'ionicons/icons';
import { StorageService } from '../../../../services/storage';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonIcon,
  ],
})
export class MisDatosComponent implements OnInit {

  datos = {
    nombre:   '',
    email:    '',
    telefono: '',
    oficio:   '',
  };

  constructor(
    private storage: StorageService,
    private toast:   ToastController,
  ) {
    addIcons({ personOutline, mailOutline, callOutline, constructOutline, saveOutline });
  }

  async ngOnInit(): Promise<void> {
    this.datos.nombre   = await this.storage.get('tud_nombre')   || '';
    this.datos.email    = await this.storage.get('tud_email')    || '';
    this.datos.telefono = await this.storage.get('tud_telefono') || '';
    this.datos.oficio   = await this.storage.get('tud_oficio')   || '';
  }

  async guardar(): Promise<void> {
    this.storage.set('tud_nombre',   this.datos.nombre);
    this.storage.set('tud_email',    this.datos.email);
    this.storage.set('tud_telefono', this.datos.telefono);
    this.storage.set('tud_oficio',   this.datos.oficio);

    const t = await this.toast.create({
      message:  'Datos guardados correctamente',
      duration: 2000,
      position: 'bottom',
    });
    await t.present();
  }
}