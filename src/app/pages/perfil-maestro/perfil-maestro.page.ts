import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-perfil-maestro',
  templateUrl: './perfil-maestro.page.html',
  styleUrls: ['./perfil-maestro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PerfilMaestroPage implements OnInit {
  constructor() { }
  ngOnInit() { }
}