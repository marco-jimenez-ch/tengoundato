import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonBadge,
  IonSpinner,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  trashOutline,
  starOutline,
  callOutline,
  constructOutline,
  mapOutline,
  cloudOfflineOutline,
} from 'ionicons/icons';
import { ApiService, Maestro, Solicitud } from '../../services/api';
import { StorageService } from '../../services/storage';

// Claves de Storage para persistencia offline
const KEY_MAESTROS    = 'tud_maestros_cache';
const KEY_SOLICITUDES = 'tud_solicitudes_cache';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonBadge,
    IonSpinner,
  ],
})
export class ListadoPage implements OnInit {

  maestros:     Maestro[]   = [];
  solicitudes:  Solicitud[] = [];
  isLoading   = false;
  errorMsg    = '';
  modoOffline = false;

  constructor(
    private api:     ApiService,
    private router:  Router,
    private toast:   ToastController,
    private alert:   AlertController,
    private storage: StorageService,
  ) {
    addIcons({
      addOutline, trashOutline, starOutline,
      callOutline, constructOutline, mapOutline,
      cloudOfflineOutline,
    });
  }

  ngOnInit(): void {
    this.cargarMaestros();
    this.cargarSolicitudes();
  }

  // GET maestros — con fallback a Storage si falla la API (criterio S6)
  cargarMaestros(): void {
    this.isLoading  = true;
    this.errorMsg   = '';
    this.modoOffline = false;

    this.api.getMaestros().subscribe(
      async (data) => {
        this.maestros  = data;
        this.isLoading = false;
        // Guardar en Storage como caché offline
        this.storage.set(KEY_MAESTROS, JSON.stringify(data));
      },
      async (error) => {
        console.error('Error API maestros:', error);
        this.isLoading = false;

        // Fallback: mostrar datos almacenados anteriormente
        const cache = await this.storage.get(KEY_MAESTROS);
        if (cache) {
          this.maestros    = JSON.parse(cache);
          this.modoOffline = true;
          this.mostrarToast('Sin conexión — mostrando datos guardados');
        } else {
          this.errorMsg = 'Sin conexión y sin datos guardados. Intenta más tarde.';
        }
      }
    );
  }

  // GET solicitudes — con fallback a Storage
  cargarSolicitudes(): void {
    this.api.getSolicitudes().subscribe(
      async (data) => {
        this.solicitudes = data;
        this.storage.set(KEY_SOLICITUDES, JSON.stringify(data));
      },
      async (error) => {
        console.error('Error API solicitudes:', error);
        const cache = await this.storage.get(KEY_SOLICITUDES);
        if (cache) {
          this.solicitudes = JSON.parse(cache);
        }
      }
    );
  }

  // POST solicitud
  async crearSolicitud(maestro: Maestro): Promise<void> {
    const alerta = await this.alert.create({
      header: 'Nueva solicitud',
      inputs: [
        {
          name:        'descripcion',
          type:        'textarea',
          placeholder: 'Describe el trabajo que necesitas',
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Enviar',
          handler: (data) => {
            if (!data.descripcion) return false;
            const solicitud: Solicitud = {
              clienteEmail: localStorage.getItem('tud_email') || '',
              maestroId:    maestro.id!,
              descripcion:  data.descripcion,
              estado:       'pendiente',
            };
            this.api.createSolicitud(solicitud).subscribe(
              () => {
                this.mostrarToast('Solicitud enviada correctamente');
                this.cargarSolicitudes();
              },
              (error) => {
                this.mostrarToast('Error al enviar solicitud');
                console.error(error);
              }
            );
            return true;
          }
        }
      ]
    });
    await alerta.present();
  }

  // DELETE solicitud
  eliminarSolicitud(id: number): void {
    this.api.deleteSolicitud(id).subscribe(
      () => {
        this.mostrarToast('Solicitud eliminada');
        this.cargarSolicitudes();
      },
      (error) => {
        this.mostrarToast('Error al eliminar');
        console.error(error);
      }
    );
  }

  irAlMapa(): void {
    this.router.navigateByUrl('/mapa');
  }

  verDetalle(id: number): void {
    this.router.navigateByUrl(`/detalle-maestro/${id}`);
  }

  private async mostrarToast(msg: string): Promise<void> {
    const t = await this.toast.create({
      message:  msg,
      duration: 2500,
      position: 'bottom',
    });
    await t.present();
  }
}