import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilMaestroPage } from './perfil-maestro.page';

describe('PerfilMaestroPage', () => {
  let component: PerfilMaestroPage;
  let fixture: ComponentFixture<PerfilMaestroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilMaestroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
