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
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import { DbTaskService } from '../../services/db-task';
import { StorageService } from '../../services/storage';

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

  // Términos de uso
  aceptaTerminos  = false;
  terminosTocado  = false;

  constructor(
    private router:  Router,
    private toast:   ToastController,
    private dbTask:  DbTaskService,
    private storage: StorageService,
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
      shieldCheckmarkOutline,
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
    if (!this.form.nombre.trim())                           return false;
    if (!this.emailValido())                                return false;
    if (!this.form.telefono.trim())                         return false;
    if (this.form.password.length < 6)                     return false;
    if (this.form.password !== this.form.confirmar)         return false;
    if (this.rol === 'maestro' && !this.form.oficio)        return false;
    if (!this.aceptaTerminos)                               return false;
    return true;
  }

  async onSubmit(): Promise<void> {
    ['nombre', 'email', 'telefono', 'password', 'confirmar'].forEach(c => this.tocar(c));
    if (this.rol === 'maestro') this.tocar('oficio');
    this.terminosTocado = true;

    this.errorMsg = '';

    if (!this.aceptaTerminos) {
      this.errorMsg = 'Debes aceptar los Términos de Uso para continuar.';
      return;
    }

    if (!this.formularioValido()) {
      this.errorMsg = 'Por favor completa todos los campos correctamente.';
      return;
    }

    this.isLoading = true;

    const registrado = await this.dbTask.registrarSesion(
      this.form.email.trim().toLowerCase(),
      this.form.password
    );

    this.isLoading = false;

    if (!registrado) {
      this.errorMsg = 'Error al crear la cuenta. Intenta nuevamente.';
      return;
    }

    await this.storage.set('tud_user',     this.form.email.trim().toLowerCase());
    await this.storage.set('tud_email',    this.form.email.trim().toLowerCase());
    await this.storage.set('tud_nombre',   this.form.nombre);
    await this.storage.set('tud_telefono', this.form.telefono);
    await this.storage.set('tud_oficio',   this.form.oficio);
    await this.storage.set('tud_role',     this.rol);

    localStorage.setItem('tud_role',   this.rol);
    localStorage.setItem('tud_email',  this.form.email.trim().toLowerCase());
    localStorage.setItem('tud_nombre', this.form.nombre);

    const t = await this.toast.create({
      message:  '¡Cuenta creada exitosamente! 🎉',
      duration: 2000,
      position: 'bottom',
      cssClass:  'tud-toast',
    });
    await t.present();

    const destino = this.rol === 'maestro' ? '/maestro' : '/cliente';
    this.router.navigateByUrl(destino, { replaceUrl: true });
  }

  verTerminos(): void {
    this.router.navigateByUrl('/terminos');
  }

  volver(): void {
    history.back();
  }

  irALogin(): void {
    this.router.navigateByUrl('/login');
  }
}