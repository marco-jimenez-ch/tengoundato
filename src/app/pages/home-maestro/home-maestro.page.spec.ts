import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeMaestroPage } from './home-maestro.page';

describe('HomeMaestroPage', () => {
  let component: HomeMaestroPage;
  let fixture: ComponentFixture<HomeMaestroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMaestroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
