import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

@Component({
  selector:    'app-root',
  templateUrl: 'app.component.html',
  standalone:  true,
  imports:     [IonApp, IonRouterOutlet, IonicStorageModule],
  providers:   [SQLite],
})
export class AppComponent {}