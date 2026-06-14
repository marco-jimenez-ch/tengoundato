import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonBadge, IonButton, IonIcon,
  IonSegment, IonSegmentButton, IonLabel,
  ToastController, AnimationController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, cashOutline, documentOutline } from 'ionicons/icons';

interface Solicitud {
  id: number;
  cliente: string;
  iniciales: string;
  servicio: string;
  descripcion: string;
  comuna: string;
  presupuesto: number;
  fecha: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  estadoTexto: string;
}

@Component({
  selector: 'app-solicitudes-maestro',
  templateUrl: './solicitudes-maestro.page.html',
  styleUrls: ['./solicitudes-maestro.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonBadge, IonButton, IonIcon,
    IonSegment, IonSegmentButton, IonLabel,
  ],
})
export class SolicitudesMaestroPage implements OnInit {

  filtroActivo = 'todas';

  solicitudes: Solicitud[] = [
    {
      id: 1, cliente: 'María López', iniciales: 'ML',
      servicio: 'Instalación eléctrica', descripcion: 'Necesito instalar 3 enchufes nuevos en el living.',
      comuna: 'Providencia', presupuesto: 30000, fecha: 'Hoy 10:30',
      estado: 'pendiente', estadoTexto: 'Pendiente',
    },
    {
      id: 2, cliente: 'Roberto Paz', iniciales: 'RP',
      servicio: 'Reparación de cortocircuito', descripcion: 'Se fue la luz en un circuito del baño.',
      comuna: 'Ñuñoa', presupuesto: 20000, fecha: 'Ayer 15:00',
      estado: 'aceptada', estadoTexto: 'Aceptada',
    },
    {
      id: 3, cliente: 'Claudia Vera', iniciales: 'CV',
      servicio: 'Cambio de tablero', descripcion: 'Tablero eléctrico antiguo, necesita reemplazo.',
      comuna: 'Las Condes', presupuesto: 85000, fecha: 'Lun 09:00',
      estado: 'pendiente', estadoTexto: 'Pendiente',
    },
  ];

  solicitudesFiltradas: Solicitud[] = [];

  constructor(
    private router: Router,
    private toast: ToastController,
    private animCtrl: AnimationController,
  ) {
    addIcons({ locationOutline, cashOutline, documentOutline });
  }

  ngOnInit(): void {
    this.filtrar();
  }

  filtrar(): void {
    if (this.filtroActivo === 'todas') {
      this.solicitudesFiltradas = [...this.solicitudes];
    } else {
      this.solicitudesFiltradas = this.solicitudes.filter(s => s.estado === this.filtroActivo);
    }
  }

  badgeColor(estado: string): string {
    return { pendiente: 'warning', aceptada: 'success', rechazada: 'danger' }[estado] ?? 'medium';
  }

  async aceptar(s: Solicitud, e: Event): Promise<void> {
    e.stopPropagation();
    s.estado     = 'aceptada';
    s.estadoTexto = 'Aceptada';
    this.filtrar();

    const t = await this.toast.create({
      message: `Solicitud de ${s.cliente} aceptada ✓`,
      duration: 2000, position: 'bottom',
    });
    await t.present();
  }

  async rechazar(s: Solicitud, e: Event): Promise<void> {
    e.stopPropagation();
    s.estado     = 'rechazada';
    s.estadoTexto = 'Rechazada';
    this.filtrar();

    const t = await this.toast.create({
      message: `Solicitud rechazada`,
      duration: 2000, position: 'bottom', color: 'danger',
    });
    await t.present();
  }

  verDetalle(s: Solicitud): void {
    this.router.navigate(['/detalle-maestro', s.id]);
  }
}