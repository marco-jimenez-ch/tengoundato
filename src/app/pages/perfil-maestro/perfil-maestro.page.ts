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
import { logOutOutline } from 'ionicons/icons';
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

  segmentoActivo: string = 'mis-datos';

  constructor(
    private router:  Router,
    private dbTask:  DbTaskService,
    private storage: StorageService,
    private toast:   ToastController,
  ) {
    addIcons({ logOutOutline });
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
}