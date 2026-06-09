import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudesMaestroPage } from './solicitudes-maestro.page';

describe('SolicitudesMaestroPage', () => {
  let component: SolicitudesMaestroPage;
  let fixture: ComponentFixture<SolicitudesMaestroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesMaestroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
