import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  callOutline,
  locationOutline,
  createOutline,
} from 'ionicons/icons';

interface Historial {
  id: number;
  servicio: string;
  maestro: string;
  fecha: string;
  rating: number;
}

@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.page.html',
  styleUrls: ['./perfil-cliente.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonSpinner,
  ],
})
export class PerfilClientePage implements OnInit {

  iniciales = '';
  editando  = false;
  isLoading = false;

  form = {
    nombre:   '',
    email:    '',
    telefono: '',
    comuna:   '',
  };

  formOriginal = { ...this.form };

  historial: Historial[] = [
    { id: 1, servicio: 'Instalación eléctrica', maestro: 'Juan Pérez',   fecha: '2 jun 2026', rating: 5   },
    { id: 2, servicio: 'Gasfitería',             maestro: 'Carlos Rojas', fecha: '18 may 2026', rating: 4  },
    { id: 3, servicio: 'Pintura interior',        maestro: 'Luis Mora',    fecha: '3 may 2026', rating: 5  },
  ];

  constructor(private toast: ToastController) {
    addIcons({ personOutline, mailOutline, callOutline, locationOutline, createOutline });
  }

  ngOnInit(): void {
    const email  = localStorage.getItem('tud_email')  ?? 'cliente@tud.cl';
    const nombre = localStorage.getItem('tud_nombre') ?? this.nombreDesdeEmail(email);

    this.form = {
      nombre,
      email,
      telefono: localStorage.getItem('tud_telefono') ?? '',
      comuna:   localStorage.getItem('tud_comuna')   ?? '',
    };

    this.formOriginal = { ...this.form };
    this.iniciales = nombre.split(' ').map((p: string) => p[0].toUpperCase()).join('').slice(0, 2);
  }

  activarEdicion(): void {
    this.formOriginal = { ...this.form };
    this.editando = true;
  }

  cancelarEdicion(): void {
    this.form     = { ...this.formOriginal };
    this.editando = false;
  }

  async guardar(): Promise<void> {
    this.isLoading = true;
    await this.delay(800);
    this.isLoading = false;

    localStorage.setItem('tud_email',    this.form.email);
    localStorage.setItem('tud_nombre',   this.form.nombre);
    localStorage.setItem('tud_telefono', this.form.telefono);
    localStorage.setItem('tud_comuna',   this.form.comuna);

    this.iniciales = this.form.nombre
      .split(' ')
      .map((p: string) => p[0].toUpperCase())
      .join('')
      .slice(0, 2);

    this.editando = false;

    const t = await this.toast.create({
      message:  'Perfil actualizado',
      duration: 2000,
      position: 'bottom',
    });
    await t.present();
  }

  private nombreDesdeEmail(email: string): string {
    const partes = email.split('@')[0].split('.');
    return partes.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}