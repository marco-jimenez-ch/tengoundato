import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular/standalone';
import { BehaviorSubject, Observable } from 'rxjs';
import { SesionData } from './sesion-data';

@Injectable({ providedIn: 'root' })
export class DbTaskService {

  public database: any = null;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  listaUsuarios = new BehaviorSubject<SesionData[]>([]);

  private tablaUsuarios: string = `CREATE TABLE IF NOT EXISTS sesion_data(
    user_name TEXT(8) PRIMARY KEY NOT NULL,
    password  TEXT                NOT NULL,
    active    INTEGER             NOT NULL
  );`;

  constructor(
    private platform:        Platform,
    public  toastController: ToastController,
  ) {
    this.inicializar();
  }

  private inicializar(): void {
    this.platform.ready().then(() => {
      // Solo intenta SQLite en plataforma nativa
      if (this.platform.is('capacitor') || this.platform.is('cordova')) {
        this.crearBD();
      } else {
        // En browser usa localStorage como fallback
        console.log('Modo browser: usando localStorage en lugar de SQLite');
        this.isDbReady.next(true);
      }
    });
  }

  private async crearBD(): Promise<void> {
    try {
      const { SQLite } = await import('@awesome-cordova-plugins/sqlite/ngx');
      const sqlite = new SQLite();
      const db = await sqlite.create({ name: 'tengoundato.db', location: 'default' });
      this.database = db;
      await this.crearTablas();
      this.presentToast('BD Creada');
    } catch (e) {
      console.error('Error creando BD SQLite:', e);
      this.isDbReady.next(true);
    }
  }

  async crearTablas(): Promise<void> {
    try {
      await this.database.executeSql(this.tablaUsuarios, []);
      this.isDbReady.next(true);
    } catch (e) {
      console.error('Error crearTablas:', e);
      this.isDbReady.next(true);
    }
  }

  dbState(): Observable<boolean> {
    return this.isDbReady.asObservable();
  }

  fetchUsuarios(): Observable<SesionData[]> {
    return this.listaUsuarios.asObservable();
  }

  // ── Operaciones SQLite con fallback a localStorage ────────────────────────

  async obtenerSesionActiva(): Promise<SesionData | null> {
    if (this.database) {
      try {
        const res = await this.database.executeSql(
          'SELECT * FROM sesion_data WHERE active = 1 LIMIT 1', []
        );
        if (res.rows.length > 0) {
          return {
            user_name: res.rows.item(0).user_name,
            password:  res.rows.item(0).password,
            active:    res.rows.item(0).active,
          };
        }
        return null;
      } catch (e) { return null; }
    }
    // Fallback browser
    const role  = localStorage.getItem('tud_role');
    const email = localStorage.getItem('tud_email');
    if (role && email) {
      return { user_name: email, password: '', active: 1 };
    }
    return null;
  }

  async validarUsuario(user_name: string, password: string): Promise<SesionData | null> {
    if (this.database) {
      try {
        const res = await this.database.executeSql(
          'SELECT * FROM sesion_data WHERE user_name = ? AND password = ?',
          [user_name, password]
        );
        if (res.rows.length > 0) {
          return {
            user_name: res.rows.item(0).user_name,
            password:  res.rows.item(0).password,
            active:    res.rows.item(0).active,
          };
        }
        return null;
      } catch (e) { return null; }
    }
    // Fallback browser — busca en localStorage
    const stored = localStorage.getItem('tud_user_' + user_name);
    if (stored) {
      const userData = JSON.parse(stored);
      if (userData.password === password) {
        return { user_name, password, active: 1 };
      }
    }
    return null;
  }

  async registrarSesion(user_name: string, password: string): Promise<boolean> {
    if (this.database) {
      try {
        await this.database.executeSql(
          'INSERT OR IGNORE INTO sesion_data (user_name, password, active) VALUES (?, ?, 1)',
          [user_name, password]
        );
        this.buscarSesiones();
        return true;
      } catch (e) { return false; }
    }
    // Fallback browser
    localStorage.setItem('tud_user_' + user_name, JSON.stringify({ password, active: 1 }));
    return true;
  }

  async actualizarEstadoSesion(user_name: string, active: 0 | 1): Promise<void> {
    if (this.database) {
      try {
        await this.database.executeSql(
          'UPDATE sesion_data SET active = ? WHERE user_name = ?',
          [active, user_name]
        );
        this.buscarSesiones();
      } catch (e) { console.error(e); }
    } else {
      // Fallback browser
      const stored = localStorage.getItem('tud_user_' + user_name);
      if (stored) {
        const userData = JSON.parse(stored);
        userData.active = active;
        localStorage.setItem('tud_user_' + user_name, JSON.stringify(userData));
      }
    }
  }

  buscarSesiones(): void {
    if (!this.database) return;
    this.database.executeSql('SELECT * FROM sesion_data', []).then((res: any) => {
      const items: SesionData[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            user_name: res.rows.item(i).user_name,
            password:  res.rows.item(i).password,
            active:    res.rows.item(i).active,
          });
        }
      }
      this.listaUsuarios.next(items);
    });
  }

  async presentToast(mensaje: string): Promise<void> {
    const toast = await this.toastController.create({
      message:  mensaje,
      duration: 3000,
    });
    toast.present();
  }
}