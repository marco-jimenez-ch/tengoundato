import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  checkmarkOutline,
  chevronBackOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, CommonModule]
})
export class OnboardingPage {

  slideActual = 0;

  slides = [
    {
      titulo:      '',
      descripcion: '',
      bg:          '#E8A020',
    },
    {
      titulo:      'Maestros verificados',
      descripcion: 'Identidad validada, calificaciones reales y portafolio de trabajos anteriores.',
      bg:          '#0F2D52',
    },
    {
      titulo:      'Contacto directo',
      descripcion: 'Un toque y abres WhatsApp con el maestro. Sin intermediarios ni demoras.',
      bg:          '#1A4A7A',
    }
  ];

  constructor(private router: Router) {
    addIcons({ arrowForwardOutline, checkmarkOutline, chevronBackOutline });
  }

  siguiente() {
    if (this.slideActual < this.slides.length - 1) {
      this.slideActual++;
    } else {
      this.ir();
    }
  }

  anterior() {
    if (this.slideActual > 0) this.slideActual--;
  }

  ir() {
    localStorage.setItem('tud_onboarding', 'done');
    this.router.navigate(['/login']);
  }

  get slide()    { return this.slides[this.slideActual]; }
  get esUltimo() { return this.slideActual === this.slides.length - 1; }
}