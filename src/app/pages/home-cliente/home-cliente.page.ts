import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonSearchbar,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

interface Maestro {
  id: number;
  nombre: string;
  iniciales: string;
  oficio: string;
  categoria: string;
  rating: number;
  reviews: number;
  precio: number;
}

interface Solicitud {
  id: number;
  servicio: string;
  maestro: string;
  estado: string;
  estadoTexto: string;
}

interface Categoria {
  id: string;
  nombre: string;
  icono: string;
}

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonSearchbar,
    IonFabButton,
    IonIcon,
  ],
})
export class HomeClientePage implements OnInit {

  nombreUsuario = '';
  iniciales     = '';
  busqueda      = '';
  categoriaActiva = 'todos';

  categorias: Categoria[] = [
    { id: 'todos',        nombre: 'Todos',       icono: '🔍' },
    { id: 'electricista', nombre: 'Electricista', icono: '⚡' },
    { id: 'gasfiter',     nombre: 'Gasfiter',     icono: '🔧' },
    { id: 'pintor',       nombre: 'Pintor',       icono: '🎨' },
    { id: 'carpintero',   nombre: 'Carpintero',   icono: '🪚' },
    { id: 'jardinero',    nombre: 'Jardinero',    icono: '🌿' },
  ];

  solicitudesActivas: Solicitud[] = [
    {
      id: 1,
      servicio: 'Instalación eléctrica',
      maestro: 'Juan Pérez',
      estado: 'en-curso',
      estadoTexto: 'En curso',
    },
  ];

  maestros: Maestro[] = [
    { id: 1, nombre: 'Juan Pérez',   iniciales: 'JP', oficio: 'Electricista', categoria: 'electricista', rating: 4.8, reviews: 32, precio: 15000 },
    { id: 2, nombre: 'Carlos Rojas', iniciales: 'CR', oficio: 'Gasfiter',     categoria: 'gasfiter',     rating: 4.6, reviews: 18, precio: 12000 },
    { id: 3, nombre: 'Luis Mora',    iniciales: 'LM', oficio: 'Pintor',       categoria: 'pintor',       rating: 4.9, reviews: 45, precio: 10000 },
    { id: 4, nombre: 'Pedro Soto',   iniciales: 'PS', oficio: 'Carpintero',   categoria: 'carpintero',   rating: 4.7, reviews: 27, precio: 14000 },
    { id: 5, nombre: 'Ana González', iniciales: 'AG', oficio: 'Jardinera',    categoria: 'jardinero',    rating: 4.5, reviews: 12, precio: 9000  },
  ];

  maestrosFiltrados: Maestro[] = [];

  constructor(private router: Router) {
    addIcons({ addOutline });
  }

  ngOnInit(): void {
    const email  = localStorage.getItem('tud_email') ?? 'cliente@tud.cl';
    const nombre = localStorage.getItem('tud_nombre');

    if (nombre) {
      this.nombreUsuario = nombre;
      this.iniciales = nombre.split(' ').map((p: string) => p[0].toUpperCase()).join('').slice(0, 2);
    } else {
      const partes = email.split('@')[0].split('.');
      this.nombreUsuario = partes.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      this.iniciales     = partes.map(p => p.charAt(0).toUpperCase()).join('').slice(0, 2);
    }

    this.maestrosFiltrados = [...this.maestros];
  }

  seleccionarCategoria(id: string): void {
    this.categoriaActiva = id;
    this.filtrarServicios();
  }

  filtrarServicios(): void {
    let resultado = [...this.maestros];

    if (this.categoriaActiva !== 'todos') {
      resultado = resultado.filter(m => m.categoria === this.categoriaActiva);
    }

    if (this.busqueda.trim()) {
      const q = this.busqueda.trim().toLowerCase();
      resultado = resultado.filter(
        m => m.nombre.toLowerCase().includes(q) || m.oficio.toLowerCase().includes(q)
      );
    }

    this.maestrosFiltrados = resultado;
  }

  verMaestro(maestro: Maestro): void {
    this.router.navigate(['/detalle-maestro', maestro.id]);
  }

  nuevaSolicitud(): void {
    this.router.navigate(['/cliente/solicitudes']);
  }

  irAPerfil(): void {
    this.router.navigate(['/cliente/perfil']);
  }
}