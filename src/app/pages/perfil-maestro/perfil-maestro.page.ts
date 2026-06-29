import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline, cameraOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { MisDatosComponent } from './components/mis-datos/mis-datos.component';
import { ExperienciaLaboralComponent } from './components/experiencia-laboral/experiencia-laboral.component';
import { CertificacionesComponent } from './components/certificaciones/certificaciones.component';
import { DbTaskService } from '../../services/db-task';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-perfil-maestro',
  templateUrl: './perfil-maestro.page.html',
  styleUrls: ['./perfil-maestro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonButton,
    IonIcon,
    MisDatosComponent,
    ExperienciaLaboralComponent,
    CertificacionesComponent,
  ],
})
export class PerfilMaestroPage {

  segmentoActivo: string    = 'mis-datos';
  fotoPerfil:     string | null = null;

  constructor(
    private router:  Router,
    private dbTask:  DbTaskService,
    private storage: StorageService,
    private toast:   ToastController,
  ) {
    addIcons({ logOutOutline, cameraOutline });
    this.cargarFoto();
  }

  async cargarFoto(): Promise<void> {
    this.fotoPerfil = await this.storage.get('tud_foto') || null;
  }

  async tomarFoto(): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality:      90,
        allowEditing: true,
        resultType:   CameraResultType.DataUrl,
        source:       CameraSource.Prompt,
      });
      if (image.dataUrl) {
        this.fotoPerfil = image.dataUrl;
        this.storage.set('tud_foto', image.dataUrl);
        this.mostrarToast('Foto actualizada');
      }
    } catch (error) {
      console.error(error);
    }
  }

  cambiarSegmento(event: any): void {
    this.segmentoActivo = event.detail.value;
  }

  async cerrarSesion(): Promise<void> {
    const user = await this.storage.get('tud_user');
    if (user) {
      await this.dbTask.actualizarEstadoSesion(user, 0);
    }
    await this.storage.clear();
    localStorage.removeItem('tud_role');
    localStorage.removeItem('tud_email');
    localStorage.removeItem('tud_nombre');

    const t = await this.toast.create({
      message:  'Sesión cerrada correctamente',
      duration: 2000,
      position: 'bottom',
    });
    await t.present();

    this.router.navigateByUrl('/login', { replaceUrl: true });
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