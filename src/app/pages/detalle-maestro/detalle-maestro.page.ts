import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-detalle-maestro',
  templateUrl: './detalle-maestro.page.html',
  styleUrls: ['./detalle-maestro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DetalleMaestroPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
