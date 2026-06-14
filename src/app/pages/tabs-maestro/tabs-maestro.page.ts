import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  listOutline,
  personOutline,
  logOutOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs-maestro',
  templateUrl: './tabs-maestro.page.html',
  styleUrls: ['./tabs-maestro.page.scss'],
  standalone: true,
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
  ],
})
export class TabsMaestroPage {

  constructor(
    private router: Router,
    private alert:  AlertController,
  ) {
    addIcons({ homeOutline, listOutline, personOutline, logOutOutline });
  }

  async cerrarSesion(): Promise<void> {
    const a = await this.alert.create({
      header:  'Cerrar sesión',
      message: '¿Estás seguro que deseas salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          role: 'destructive',
          handler: () => {
            localStorage.removeItem('tud_role');
            localStorage.removeItem('tud_email');
            localStorage.removeItem('tud_nombre');
            this.router.navigateByUrl('/login', { replaceUrl: true });
          },
        },
      ],
    });
    await a.present();
  }
}
