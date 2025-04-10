import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EleveDashboardComponent } from './eleve-dashboard.component';

describe('EleveDashboardComponent', () => {
  let component: EleveDashboardComponent;
  let fixture: ComponentFixture<EleveDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EleveDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EleveDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
