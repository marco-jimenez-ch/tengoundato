import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { DbTaskService } from '../../services/db-task';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonSpinner,
  ],
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;
  showPassword = false;
  isLoading    = false;
  errorMsg     = '';

  constructor(
    private fb:      FormBuilder,
    private router:  Router,
    private toast:   ToastController,
    private dbTask:  DbTaskService,
    private storage: StorageService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.dbTask.dbState().subscribe(async (ready) => {
      if (ready) {
        const sesion = await this.dbTask.obtenerSesionActiva();
        if (sesion) {
          const role    = await this.storage.get('tud_role');
          const destino = role === 'maestro' ? '/maestro' : '/cliente';
          this.router.navigateByUrl(destino, { replaceUrl: true });
        }
      }
    });
  }

  get email()    { return this.loginForm.get('email')!;    }
  get password() { return this.loginForm.get('password')!; }

  get emailError(): string {
    if (this.email.touched && this.email.hasError('required')) return 'El correo es obligatorio.';
    if (this.email.touched && this.email.hasError('email'))    return 'Ingresa un correo válido.';
    return '';
  }

  get passwordError(): string {
    if (this.password.touched && this.password.hasError('required'))  return 'La contraseña es obligatoria.';
    if (this.password.touched && this.password.hasError('minlength')) return 'Mínimo 6 caracteres.';
    return '';
  }

  async onSubmit(): Promise<void> {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMsg  = '';

    const { email, password } = this.loginForm.value;

    const user = await this.dbTask.validarUsuario(
      email.trim().toLowerCase(),
      password
    );

    this.isLoading = false;

    if (!user) {
      this.errorMsg = 'Correo o contraseña incorrectos.';
      return;
    }

    await this.dbTask.actualizarEstadoSesion(user.user_name, 1);

    await this.storage.set('tud_user',  user.user_name);
    await this.storage.set('tud_email', user.user_name);

    const role = user.user_name.includes('maestro') ? 'maestro' : 'cliente';
    await this.storage.set('tud_role', role);
    localStorage.setItem('tud_role',  role);
    localStorage.setItem('tud_email', user.user_name);

    const destino = role === 'maestro' ? '/maestro' : '/cliente';
    this.router.navigateByUrl(destino, { replaceUrl: true });
  }

  irARegistro(): void {
    this.router.navigateByUrl('/registro');
  }

  irARecuperacion(): void {
    this.showToast('Función disponible próximamente 🔧');
  }

  irAGoogle(): void {
    this.showToast('Login con Google próximamente 🔧');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  private async showToast(msg: string): Promise<void> {
    const t = await this.toast.create({
      message:  msg,
      duration: 2000,
      position: 'bottom',
      cssClass:  'tud-toast',
    });
    await t.present();
  }
}