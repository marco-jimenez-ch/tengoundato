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
  searchOutline,
  personOutline,
  logOutOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs-cliente',
  templateUrl: './tabs-cliente.page.html',
  styleUrls: ['./tabs-cliente.page.scss'],
  standalone: true,
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
  ],
})
export class TabsClientePage {

  constructor(
    private router: Router,
    private alert:  AlertController,
  ) {
    addIcons({ homeOutline, searchOutline, personOutline, logOutOutline });
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
