import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleMaestroPage } from './detalle-maestro.page';

describe('DetalleMaestroPage', () => {
  let component: DetalleMaestroPage;
  let fixture: ComponentFixture<DetalleMaestroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleMaestroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
