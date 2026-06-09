import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';

// ── Credenciales mock ────────────────────────────────────────────────────────
const MOCK_USERS = [
  { email: 'cliente@tud.cl',  password: '123456', role: 'cliente'  },
  { email: 'maestro@tud.cl',  password: '123456', role: 'maestro'  },
];

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
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // ── Getters convenientes para el template ───────────────────────────────
  get email()    { return this.loginForm.get('email')!;    }
  get password() { return this.loginForm.get('password')!; }

  get emailError(): string {
    if (this.email.touched && this.email.hasError('required')) return 'El correo es obligatorio.';
    if (this.email.touched && this.email.hasError('email'))    return 'Ingresa un correo válido.';
    return '';
  }

  get passwordError(): string {
    if (this.password.touched && this.password.hasError('required'))   return 'La contraseña es obligatoria.';
    if (this.password.touched && this.password.hasError('minlength'))  return 'Mínimo 6 caracteres.';
    return '';
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async onSubmit(): Promise<void> {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMsg  = '';

    // Simula latencia de red
    await this.delay(900);

    const { email, password } = this.loginForm.value;
    const user = MOCK_USERS.find(
      u => u.email === email.trim().toLowerCase() && u.password === password
    );

    this.isLoading = false;

    if (!user) {
      this.errorMsg = 'Correo o contraseña incorrectos.';
      return;
    }

    // Persistir sesión básica
    localStorage.setItem('tud_role',  user.role);
    localStorage.setItem('tud_email', user.email);

    // Navegar según rol
    const destino = user.role === 'maestro' ? '/home-maestro' : '/home-cliente';
    this.router.navigateByUrl(destino, { replaceUrl: true });
  }

  // ── Navegación ────────────────────────────────────────────────────────────
  irARegistro():      void { this.router.navigateByUrl('/registro'); }
  irARecuperacion():  void { this.showToast('Función disponible próximamente 🔧'); }
  irAGoogle():        void { this.showToast('Login con Google próximamente 🔧'); }

  // ── Helpers ───────────────────────────────────────────────────────────────
  togglePassword(): void { this.showPassword = !this.showPassword; }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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