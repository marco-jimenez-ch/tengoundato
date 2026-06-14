import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  locationOutline,
  cashOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface Solicitud {
  id: number;
  cliente: string;
  iniciales: string;
  servicio: string;
  descripcion: string;
  comuna: string;
  presupuesto: number;
}

@Component({
  selector: 'app-home-maestro',
  templateUrl: './home-maestro.page.html',
  styleUrls: ['./home-maestro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    MatProgressBarModule,
  ],
})
export class HomeMaestroPage implements OnInit {

  nombreUsuario = '';
  iniciales     = '';
  disponible    = true;

  solicitudesPendientes = 3;
  trabajosCompletados   = 12;
  rating                = 4.8;

  solicitudesNuevas: Solicitud[] = [
    {
      id: 1,
      cliente:     'María González',
      iniciales:   'MG',
      servicio:    'Gasfitería',
      descripcion: 'Fuga de agua en baño principal, necesito revisión urgente.',
      comuna:      'Providencia',
      presupuesto: 25000,
    },
    {
      id: 2,
      cliente:     'Roberto Silva',
      iniciales:   'RS',
      servicio:    'Gasfitería',
      descripcion: 'Instalación de calefón nuevo marca Bosch.',
      comuna:      'Las Condes',
      presupuesto: 45000,
    },
    {
      id: 3,
      cliente:     'Carmen López',
      iniciales:   'CL',
      servicio:    'Gasfitería',
      descripcion: 'Reparación de llave de cocina que gotea.',
      comuna:      'Ñuñoa',
      presupuesto: 15000,
    },
  ];

  trabajosEnCurso: Solicitud[] = [
    {
      id: 10,
      cliente:     'Diego Muñoz',
      iniciales:   'DM',
      servicio:    'Gasfitería',
      descripcion: 'Cambio de cañerías en cocina.',
      comuna:      'Macul',
      presupuesto: 60000,
    },
  ];

  constructor(
    private router: Router,
    private toast:  ToastController,
  ) {
    addIcons({ locationOutline, cashOutline, checkmarkCircleOutline });
  }

  ngOnInit(): void {
    const email  = localStorage.getItem('tud_email') ?? 'maestro@tud.cl';
    const nombre = localStorage.getItem('tud_nombre');

    if (nombre) {
      this.nombreUsuario = nombre;
      this.iniciales = nombre.split(' ').map((p: string) => p[0].toUpperCase()).join('').slice(0, 2);
    } else {
      const partes = email.split('@')[0].split('.');
      this.nombreUsuario = partes.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      this.iniciales = partes.map((p: string) => p.charAt(0).toUpperCase()).join('').slice(0, 2);
    }

    this.solicitudesPendientes = this.solicitudesNuevas.length;
  }

  toggleDisponible(): void {
    this.disponible = !this.disponible;
    const msg = this.disponible
      ? 'Ahora estás visible para clientes'
      : 'Ahora estás invisible para clientes';
    this.showToast(msg);
  }

  aceptar(sol: Solicitud): void {
    this.solicitudesNuevas = this.solicitudesNuevas.filter(s => s.id !== sol.id);
    this.trabajosEnCurso.push(sol);
    this.solicitudesPendientes = this.solicitudesNuevas.length;
    this.showToast('Solicitud aceptada');
  }

  rechazar(sol: Solicitud): void {
    this.solicitudesNuevas = this.solicitudesNuevas.filter(s => s.id !== sol.id);
    this.solicitudesPendientes = this.solicitudesNuevas.length;
    this.showToast('Solicitud rechazada');
  }

  completar(sol: Solicitud): void {
    this.trabajosEnCurso = this.trabajosEnCurso.filter(s => s.id !== sol.id);
    this.trabajosCompletados++;
    this.showToast('¡Trabajo completado!');
  }

  irAPerfil(): void {
    this.router.navigateByUrl('/maestro/perfil');
  }

  private async showToast(msg: string): Promise<void> {
    const t = await this.toast.create({
      message:  msg,
      duration: 2000,
      position: 'bottom',
    });
    await t.present();
  }
}