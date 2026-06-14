import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonSearchbar, IonChip, IonLabel,
  IonList, IonItem, IonItemSliding, IonItemOptions, IonItemOption,
  IonCard, IonCardContent, IonSkeletonText, IonIcon,
  AnimationController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, eyeOutline } from 'ionicons/icons';

interface Maestro {
  id: number;
  nombre: string;
  iniciales: string;
  oficio: string;
  categoria: string;
  comuna: string;
  rating: number;
  reviews: number;
  precio: number;
}

interface Categoria {
  id: string;
  nombre: string;
  icono: string;
}

@Component({
  selector: 'app-listado',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonSearchbar, IonChip, IonLabel,
    IonList, IonItem, IonItemSliding, IonItemOptions, IonItemOption,
    IonCard, IonCardContent, IonSkeletonText, IonIcon,
  ],
})
export class ListadoPage implements OnInit {

  busqueda   = '';
  catActiva  = 'todos';
  cargando   = true;

  categorias: Categoria[] = [
    { id: 'todos',        nombre: 'Todos',       icono: '🔍' },
    { id: 'electricista', nombre: 'Electricista', icono: '⚡' },
    { id: 'gasfiter',     nombre: 'Gasfiter',     icono: '🔧' },
    { id: 'pintor',       nombre: 'Pintor',       icono: '🎨' },
    { id: 'carpintero',   nombre: 'Carpintero',   icono: '🪚' },
    { id: 'jardinero',    nombre: 'Jardinero',    icono: '🌿' },
  ];

  maestros: Maestro[] = [
    { id: 1, nombre: 'Juan Pérez',   iniciales: 'JP', oficio: 'Electricista', categoria: 'electricista', comuna: 'Providencia', rating: 4.8, reviews: 32, precio: 15000 },
    { id: 2, nombre: 'Carlos Rojas', iniciales: 'CR', oficio: 'Gasfiter',     categoria: 'gasfiter',     comuna: 'Ñuñoa',       rating: 4.6, reviews: 18, precio: 12000 },
    { id: 3, nombre: 'Luis Mora',    iniciales: 'LM', oficio: 'Pintor',       categoria: 'pintor',       comuna: 'Las Condes',  rating: 4.9, reviews: 45, precio: 10000 },
    { id: 4, nombre: 'Pedro Soto',   iniciales: 'PS', oficio: 'Carpintero',   categoria: 'carpintero',   comuna: 'Maipú',       rating: 4.7, reviews: 27, precio: 14000 },
    { id: 5, nombre: 'Ana González', iniciales: 'AG', oficio: 'Jardinera',    categoria: 'jardinero',    comuna: 'Vitacura',    rating: 4.5, reviews: 12, precio: 9000  },
    { id: 6, nombre: 'Mario Silva',  iniciales: 'MS', oficio: 'Electricista', categoria: 'electricista', comuna: 'La Florida',  rating: 4.3, reviews: 8,  precio: 13000 },
  ];

  maestrosFiltrados: Maestro[] = [];

  constructor(
    private router: Router,
    private animCtrl: AnimationController,
  ) {
    addIcons({ searchOutline, eyeOutline });
  }

  ngOnInit(): void {
    // Simular carga con skeleton + animación de entrada
    setTimeout(() => {
      this.cargando = false;
      this.maestrosFiltrados = [...this.maestros];
      // Animación de entrada con AnimationController (requerimiento IL2)
      setTimeout(() => this.animarEntrada(), 50);
    }, 800);
  }

  private animarEntrada(): void {
    const items = document.querySelectorAll('.maestro-item');
    items.forEach((el, i) => {
      const anim = this.animCtrl
        .create()
        .addElement(el)
        .duration(320)
        .delay(i * 60)
        .easing('ease-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(16px)', 'translateY(0)');
      anim.play();
    });
  }

  seleccionarCat(id: string): void {
    this.catActiva = id;
    this.filtrar();
  }

  filtrar(): void {
    let res = [...this.maestros];
    if (this.catActiva !== 'todos') {
      res = res.filter(m => m.categoria === this.catActiva);
    }
    const q = this.busqueda.trim().toLowerCase();
    if (q) {
      res = res.filter(m =>
        m.nombre.toLowerCase().includes(q) ||
        m.oficio.toLowerCase().includes(q)  ||
        m.comuna.toLowerCase().includes(q)
      );
    }
    this.maestrosFiltrados = res;
  }

  verDetalle(m: Maestro): void {
    this.router.navigate(['/detalle-maestro', m.id]);
  }
}