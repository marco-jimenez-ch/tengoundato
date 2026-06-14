import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonBackButton, IonButtons, IonButton, IonIcon, IonChip, IonLabel,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  locationOutline, checkmarkCircleOutline, timeOutline,
  logoWhatsapp,
} from 'ionicons/icons';

interface Resena {
  cliente: string;
  iniciales: string;
  fecha: string;
  rating: number;
  texto: string;
}

interface MaestroDetalle {
  id: number;
  nombre: string;
  iniciales: string;
  oficio: string;
  categoria: string;
  comuna: string;
  rating: number;
  reviews: number;
  precio: number;
  especialidades: string[];
  resenas: Resena[];
}

const MAESTROS: MaestroDetalle[] = [
  {
    id: 1, nombre: 'Juan Pérez', iniciales: 'JP', oficio: 'Electricista',
    categoria: 'electricista', comuna: 'Providencia', rating: 4.8, reviews: 32, precio: 15000,
    especialidades: ['Tableros eléctricos', 'Enchufes', 'Iluminación LED', 'Corrientes débiles'],
    resenas: [
      { cliente: 'María L.', iniciales: 'ML', fecha: '2 jun 2026', rating: 5, texto: 'Excelente trabajo, puntual y muy profesional.' },
      { cliente: 'Roberto P.', iniciales: 'RP', fecha: '20 may 2026', rating: 5, texto: 'Resolvió el problema rápido y dejó todo limpio.' },
    ],
  },
  {
    id: 2, nombre: 'Carlos Rojas', iniciales: 'CR', oficio: 'Gasfiter',
    categoria: 'gasfiter', comuna: 'Ñuñoa', rating: 4.6, reviews: 18, precio: 12000,
    especialidades: ['Cañerías', 'Calefont', 'Griferías', 'Instalaciones nuevas'],
    resenas: [
      { cliente: 'Paula V.', iniciales: 'PV', fecha: '15 may 2026', rating: 5, texto: 'Muy rápido y buen precio.' },
    ],
  },
];

@Component({
  selector: 'app-detalle-maestro',
  templateUrl: './detalle-maestro.page.html',
  styleUrls: ['./detalle-maestro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonBackButton, IonButtons, IonButton, IonIcon, IonChip, IonLabel,
  ],
})
export class DetalleMaestroPage implements OnInit {

  maestro: MaestroDetalle = MAESTROS[0];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastController,
  ) {
    addIcons({ locationOutline, checkmarkCircleOutline, timeOutline, logoWhatsapp });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = MAESTROS.find(m => m.id === id);
    if (found) this.maestro = found;
  }

  contactarWhatsapp(): void {
    const msg  = encodeURIComponent(`Hola ${this.maestro.nombre}, te contacto desde TengoUnDato.`);
    const url  = `https://wa.me/56912345678?text=${msg}`;
    window.open(url, '_blank');
  }

  async solicitarServicio(): Promise<void> {
    const t = await this.toast.create({
      message: `Solicitud enviada a ${this.maestro.nombre} ✓`,
      duration: 2500, position: 'bottom',
    });
    await t.present();
    this.router.navigate(['/cliente/home']);
  }
}