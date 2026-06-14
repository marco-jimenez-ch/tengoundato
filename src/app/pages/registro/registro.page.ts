import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  personOutline,
  mailOutline,
  callOutline,
  constructOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  warningOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonSpinner,
  ],
})
export class RegistroPage implements OnInit {

  rol: 'cliente' | 'maestro' = 'cliente';

  form = {
    nombre:    '',
    email:     '',
    telefono:  '',
    oficio:    '',
    password:  '',
    confirmar: '',
  };

  tocados: Record<string, boolean> = {};
  showPassword  = false;
  showConfirmar = false;
  isLoading     = false;
  errorMsg      = '';

  constructor(
    private router: Router,
    private toast:  ToastController,
  ) {
    addIcons({
      arrowBackOutline,
      personOutline,
      mailOutline,
      callOutline,
      constructOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      warningOutline,
    });
  }

  ngOnInit(): void {}

  tocar(campo: string): void {
    this.tocados[campo] = true;
  }

  campoTocado(campo: string): boolean {
    return !!this.tocados[campo];
  }

  emailValido(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email);
  }

  formularioValido(): boolean {
    if (!this.form.nombre.trim())         return false;
    if (!this.emailValido())              return false;
    if (!this.form.telefono.trim())       return false;
    if (this.form.password.length < 6)    return false;
    if (this.form.password !== this.form.confirmar) return false;
    if (this.rol === 'maestro' && !this.form.oficio) return false;
    return true;
  }

  async onSubmit(): Promise<void> {
    // Marcar todos los campos como tocados
    ['nombre', 'email', 'telefono', 'password', 'confirmar'].forEach(c => this.tocar(c));
    if (this.rol === 'maestro') this.tocar('oficio');

    this.errorMsg = '';

    if (!this.formularioValido()) {
      this.errorMsg = 'Por favor completa todos los campos correctamente.';
      return;
    }

    this.isLoading = true;
    await this.delay(1000);
    this.isLoading = false;

    // Guardar sesión mock
    localStorage.setItem('tud_role',  this.rol);
    localStorage.setItem('tud_email', this.form.email);
    localStorage.setItem('tud_nombre', this.form.nombre);

    const t = await this.toast.create({
      message:  '¡Cuenta creada exitosamente! 🎉',
      duration: 2000,
      position: 'bottom',
      cssClass:  'tud-toast',
    });
    await t.present();

    const destino = this.rol === 'maestro' ? '/home-maestro' : '/home-cliente';
    this.router.navigateByUrl(destino, { replaceUrl: true });
  }

  volver(): void {
    history.back();
  }

  irALogin(): void {
    this.router.navigateByUrl('/login');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}