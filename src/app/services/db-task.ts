import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, ToastController } from '@ionic/angular/standalone';
import { BehaviorSubject, Observable } from 'rxjs';
import { SesionData } from './sesion-data';

@Injectable({
  providedIn: 'root'
})
export class DbTaskService {

  public database!: SQLiteObject;

  tablaUsuarios: string = `CREATE TABLE IF NOT EXISTS sesion_data(
    user_name TEXT(8) PRIMARY KEY NOT NULL,
    password  INTEGER             NOT NULL,
    active    INTEGER             NOT NULL
  );`;

  listaUsuarios = new BehaviorSubject<SesionData[]>([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqlite:          SQLite,
    private platform:        Platform,
    public  toastController: ToastController,
  ) {
    this.crearBD();
  }

  // ── Estado de la BD ────────────────────────────────────────────────────────
  dbState(): Observable<boolean> {
    return this.isDbReady.asObservable();
  }

  fetchUsuarios(): Observable<SesionData[]> {
    return this.listaUsuarios.asObservable();
  }

  // ── 1. Crear la base de datos ──────────────────────────────────────────────
  crearBD(): void {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name:     'tengoundato.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.setDatabase(db);
        this.presentToast('BD Creada');
        this.crearTablas();
      }).catch(e => this.presentToast('Error BD: ' + e));
    });
  }

  // ── 2. Setear el objeto SQLiteObject ───────────────────────────────────────
  setDatabase(db: SQLiteObject): void {
    this.database = db;
  }

  // ── 3. Crear tablas ────────────────────────────────────────────────────────
  async crearTablas(): Promise<void> {
    try {
      await this.database.executeSql(this.tablaUsuarios, []);
      this.presentToast('Tabla Creada');
      this.buscarSesiones();
      this.isDbReady.next(true);
    } catch (e) {
      this.presentToast('Error crearTablas: ' + e);
    }
  }

  // ── 4. Consultar si existe sesión activa ───────────────────────────────────
  async obtenerSesionActiva(): Promise<SesionData | null> {
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
    } catch (e) {
      this.presentToast('Error sesión activa: ' + e);
      return null;
    }
  }

  // ── 5. Validar usuario que inicia sesión ───────────────────────────────────
  async validarUsuario(user_name: string, password: string): Promise<SesionData | null> {
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
    } catch (e) {
      this.presentToast('Error validar usuario: ' + e);
      return null;
    }
  }

  // ── 6. Registrar sesión ────────────────────────────────────────────────────
  async registrarSesion(user_name: string, password: string): Promise<boolean> {
    try {
      await this.database.executeSql(
        'INSERT OR IGNORE INTO sesion_data (user_name, password, active) VALUES (?, ?, 1)',
        [user_name, password]
      );
      this.buscarSesiones();
      return true;
    } catch (e) {
      this.presentToast('Error registrar sesión: ' + e);
      return false;
    }
  }

  // ── 7. Actualizar estado active ────────────────────────────────────────────
  async actualizarEstadoSesion(user_name: string, active: 0 | 1): Promise<void> {
    try {
      await this.database.executeSql(
        'UPDATE sesion_data SET active = ? WHERE user_name = ?',
        [active, user_name]
      );
      this.buscarSesiones();
    } catch (e) {
      this.presentToast('Error actualizar sesión: ' + e);
    }
  }

  // ── CRUD: buscar todas las sesiones ───────────────────────────────────────
  buscarSesiones(): void {
    this.database.executeSql('SELECT * FROM sesion_data', []).then(res => {
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

  // ── Helper toast ───────────────────────────────────────────────────────────
  async presentToast(mensaje: string): Promise<void> {
    const toast = await this.toastController.create({
      message:  mensaje,
      duration: 3000,
    });
    toast.present();
  }
}