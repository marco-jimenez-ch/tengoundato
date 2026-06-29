import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, alertCircleOutline } from 'ionicons/icons';

@Component({
  selector:    'app-page-not-found',
  templateUrl: './page-not-found.page.html',
  styleUrls:   ['./page-not-found.page.scss'],
  standalone:  true,
  imports:     [IonContent, IonButton, IonIcon],
})
export class PageNotFoundPage {

  constructor(private router: Router) {
    addIcons({ homeOutline, alertCircleOutline });
  }

  irAlHome(): void {
    const role    = localStorage.getItem('tud_role');
    const destino = role === 'maestro'
      ? '/maestro'
      : role === 'cliente'
        ? '/cliente'
        : '/onboarding';
    this.router.navigateByUrl(destino, { replaceUrl: true });
  }
}