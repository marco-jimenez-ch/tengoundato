import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';
import { AnimationController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton],
})
export class OnboardingPage implements AfterViewInit {

  constructor(
    private router:   Router,
    private animCtrl: AnimationController,
    private el:       ElementRef,
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.animarEntrada(), 50);
  }

  private animarEntrada(): void {
    const host     = this.el.nativeElement;
    const elTop    = host.querySelector('.splash-top');
    const elBottom = host.querySelector('.splash-bottom');

    if (!elTop || !elBottom) {
      if (elTop)    (elTop as HTMLElement).style.opacity = '1';
      if (elBottom) (elBottom as HTMLElement).style.opacity = '1';
      return;
    }

    const animTitulo = this.animCtrl
      .create('anim-titulo')
      .addElement(elTop)
      .duration(650)
      .easing('ease-out')
      .fromTo('opacity',   '0', '1')
      .fromTo('transform', 'translateX(-24px)', 'translateX(0)');

    const animBotones = this.animCtrl
      .create('anim-botones')
      .addElement(elBottom)
      .duration(550)
      .delay(400)
      .easing('ease-out')
      .fromTo('opacity',   '0', '1')
      .fromTo('transform', 'translateY(20px)', 'translateY(0)');

    animTitulo.play();
    animBotones.play();
  }

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }

  irATerminos(): void {
    this.router.navigate(['/terminos']);
  }
}