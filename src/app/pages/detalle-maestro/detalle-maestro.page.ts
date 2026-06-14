import { MatChipsModule } from '@angular/material/chips';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonBackButton, IonButtons, IonButton, IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  locationOutline, checkmarkCircleOutline, timeOutline,
  logoWhatsapp,
} from 'ionicons/icons';
import { MatChipsModule } from '@angular/material/chips';

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
    id: 1, nombre: 'Juan Perez', iniciales: 'JP', oficio: 'Electricista',
    categoria: 'electricista', comuna: 'Providencia', rating: 4.8, reviews: 32, precio: 15000,
    especialidades: ['Tableros electricos', 'Enchufes', 'Iluminacion LED', 'Corrientes debiles'],
    resenas: [
      { cliente: 'Maria L.', iniciales: 'ML', fecha: '2 jun 2026', rating: 5, texto: 'Excelente trabajo, puntual y muy profesional.' },
      { cliente: 'Roberto P.', iniciales: 'RP', fecha: '20 may 2026', rating: 5, texto: 'Resolvio el problema rapido y dejo todo limpio.' },
    ],
  },
  {
    id: 2, nombre: 'Carlos Rojas', iniciales: 'CR', oficio: 'Gasfiter',
    categoria: 'gasfiter', comuna: 'Nunoa', rating: 4.6, reviews: 18, precio: 12000,
    especialidades: ['Canerias', 'Calefont', 'Griferias', 'Instalaciones nuevas'],
    resenas: [
      { cliente: 'Paula V.', iniciales: 'PV', fecha: '15 may 2026', rating: 5, texto: 'Muy rapido y buen precio.' },
    ],
  },
  {
    id: 3, nombre: 'Luis Mora', iniciales: 'LM', oficio: 'Pintor',
    categoria: 'pintor', comuna: 'Las Condes', rating: 4.9, reviews: 45, precio: 10000,
    especialidades: ['Pintura interior', 'Pintura exterior', 'Estuco', 'Empapelado'],
    resenas: [
      { cliente: 'Sofia R.', iniciales: 'SR', fecha: '10 jun 2026', rating: 5, texto: 'Quedaron las paredes perfectas.' },
    ],
  },
  {
    id: 4, nombre: 'Pedro Soto', iniciales: 'PS', oficio: 'Carpintero',
    categoria: 'carpintero', comuna: 'Maipu', rating: 4.7, reviews: 27, precio: 14000,
    especialidades: ['Muebles a medida', 'Puertas', 'Pisos de madera', 'Reparaciones'],
    resenas: [
      { cliente: 'Diego M.', iniciales: 'DM', fecha: '5 jun 2026', rating: 5, texto: 'Muy buen trabajo y rapido.' },
    ],
  },
  {
    id: 5, nombre: 'Ana Gonzalez', iniciales: 'AG', oficio: 'Jardinera',
    categoria: 'jardinero', comuna: 'Vitacura', rating: 4.5, reviews: 12, precio: 9000,
    especialidades: ['Poda', 'Diseno de jardines', 'Riego automatico', 'Cesped'],
    resenas: [
      { cliente: 'Carla F.', iniciales: 'CF', fecha: '1 jun 2026', rating: 4, texto: 'Buen servicio, el jardin quedo muy bonito.' },
    ],
  },
  {
    id: 6, nombre: 'Mario Silva', iniciales: 'MS', oficio: 'Electricista',
    categoria: 'electricista', comuna: 'La Florida', rating: 4.3, reviews: 8, precio: 13000,
    especialidades: ['Enchufes', 'Iluminacion', 'Tableros'],
    resenas: [
      { cliente: 'Luis P.', iniciales: 'LP', fecha: '28 may 2026', rating: 4, texto: 'Buen trabajo, un poco demorado.' },
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
    IonBackButton, IonButtons, IonButton, IonIcon,
    MatChipsModule,
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
    const msg = encodeURIComponent(`Hola ${this.maestro.nombre}, te contacto desde TengoUnDato.`);
    const url = `https://wa.me/56912345678?text=${msg}`;
    window.open(url, '_blank');
  }

  async solicitarServicio(): Promise<void> {
    const t = await this.toast.create({
      message: `Solicitud enviada a ${this.maestro.nombre}`,
      duration: 2500, position: 'bottom',
    });
    await t.present();
    this.router.navigate(['/cliente/home']);
  }
}