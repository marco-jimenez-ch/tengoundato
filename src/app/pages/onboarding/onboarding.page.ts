import { Component, OnInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AnimationController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [IonContent],
})
export class OnboardingPage implements OnInit {

  constructor(
    private router:    Router,
    private animCtrl:  AnimationController,
    private el:        ElementRef,
  ) {}

  ngOnInit(): void {
    this.animarEntrada();
  }

  private animarEntrada(): void {
    const host = this.el.nativeElement;

    // Animación 1 — título entra desde la izquierda (Ionic)
    const animTitulo = this.animCtrl
      .create('anim-titulo')
      .addElement(host.querySelector('.splash-top'))
      .duration(650)
      .easing('ease-out')
      .fromTo('opacity',   '0', '1')
      .fromTo('transform', 'translateX(-24px)', 'translateX(0)');

    // Animación 2 — botones suben desde abajo (Ionic)
    const animBotones = this.animCtrl
      .create('anim-botones')
      .addElement(host.querySelector('.splash-bottom'))
      .duration(550)
      .delay(400)
      .easing('ease-out')
      .fromTo('opacity',   '0', '1')
      .fromTo('transform', 'translateY(20px)', 'translateY(0)');

    animTitulo.play();
    animBotones.play();
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }
}