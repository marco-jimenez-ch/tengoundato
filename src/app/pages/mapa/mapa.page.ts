import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, locateOutline } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class MapaPage implements OnInit, OnDestroy {

  latitud:   number | null = null;
  longitud:  number | null = null;
  precision: number | null = null;
  isLoading = false;
  errorMsg  = '';

  private watchId: string | null = null;

  constructor(private router: Router) {
    addIcons({ arrowBackOutline, locateOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.iniciarGeolocalizacion();
  }

  async iniciarGeolocalizacion(): Promise<void> {
    this.isLoading = true;
    this.errorMsg  = '';

    try {
      const position = await Geolocation.getCurrentPosition();
      this.latitud   = position.coords.latitude;
      this.longitud  = position.coords.longitude;
      this.precision = position.coords.accuracy;
      this.isLoading = false;

      this.watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (pos, err) => {
          if (err) { console.error(err); return; }
          if (pos) {
            this.latitud   = pos.coords.latitude;
            this.longitud  = pos.coords.longitude;
            this.precision = pos.coords.accuracy;
          }
        }
      );
    } catch (error) {
      this.errorMsg  = 'No se pudo obtener la ubicación. Verifica los permisos.';
      this.isLoading = false;
      console.error(error);
    }
  }

  // OpenStreetMap — sin API Key requerida
  get mapImageUrl(): string {
    if (this.latitud && this.longitud) {
      const lat = this.latitud;
      const lng = this.longitud;
      return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=600x300&markers=${lat},${lng},red`;
    }
    return '';
  }

  get googleMapsUrl(): string {
    if (this.latitud && this.longitud) {
      return `https://www.google.com/maps?q=${this.latitud},${this.longitud}`;
    }
    return '';
  }

  // Limpia el observador al salir — performance según guía S5
  ngOnDestroy(): void {
    if (this.watchId !== null) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }

  volver(): void {
    this.router.navigateByUrl('/cliente/listado');
  }

  abrirEnMaps(): void {
    if (this.googleMapsUrl) {
      window.open(this.googleMapsUrl, '_blank');
    }
  }
}