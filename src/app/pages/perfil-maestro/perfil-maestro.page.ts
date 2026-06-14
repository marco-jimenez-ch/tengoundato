import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonButton, IonIcon, IonSpinner, IonToggle,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mailOutline, callOutline, constructOutline,
  locationOutline, createOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-perfil-maestro',
  templateUrl: './perfil-maestro.page.html',
  styleUrls: ['./perfil-maestro.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonButton, IonIcon, IonSpinner, IonToggle],
})
export class PerfilMaestroPage implements OnInit {

  iniciales  = '';
  editando   = false;
  isLoading  = false;
  disponible = true;
  rating     = 4.8;
  trabajos   = 24;
  resenas    = 18;

  form = { nombre: '', email: '', telefono: '', oficio: 'Electricista', comuna: '', tarifa: 15000 };
  formOriginal = { ...this.form };

  constructor(private toast: ToastController) {
    addIcons({ mailOutline, callOutline, constructOutline, locationOutline, createOutline });
  }

  ngOnInit(): void {
    const email  = localStorage.getItem('tud_email')  ?? 'maestro@tud.cl';
    const nombre = localStorage.getItem('tud_nombre') ?? this.nombreDesdeEmail(email);
    this.form = {
      nombre,
      email,
      telefono: localStorage.getItem('tud_telefono') ?? '',
      oficio:   'Electricista',
      comuna:   localStorage.getItem('tud_comuna')   ?? '',
      tarifa:   15000,
    };
    this.formOriginal = { ...this.form };
    this.iniciales    = nombre.split(' ').map((p: string) => p[0].toUpperCase()).join('').slice(0, 2);
  }

  activarEdicion(): void { this.formOriginal = { ...this.form }; this.editando = true; }
  cancelarEdicion(): void { this.form = { ...this.formOriginal }; this.editando = false; }

  async guardar(): Promise<void> {
    this.isLoading = true;
    await this.delay(700);
    this.isLoading = false;
    localStorage.setItem('tud_nombre',   this.form.nombre);
    localStorage.setItem('tud_telefono', this.form.telefono);
    localStorage.setItem('tud_comuna',   this.form.comuna);
    this.iniciales = this.form.nombre.split(' ').map((p: string) => p[0].toUpperCase()).join('').slice(0, 2);
    this.editando  = false;
    const t = await this.toast.create({ message: 'Perfil actualizado ✓', duration: 2000, position: 'bottom' });
    await t.present();
  }

  async cambiarDisponibilidad(): Promise<void> {
    const msg = this.disponible ? 'Ahora estás disponible 🟢' : 'Marcado como no disponible 🔴';
    const t   = await this.toast.create({ message: msg, duration: 1800, position: 'bottom' });
    await t.present();
  }

  private nombreDesdeEmail(email: string): string {
    return email.split('@')[0].split('.').map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }

  private delay(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)); }
}