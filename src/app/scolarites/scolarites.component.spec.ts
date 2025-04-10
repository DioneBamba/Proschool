import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScolaritesComponent } from './scolarites.component';

describe('ScolaritesComponent', () => {
  let component: ScolaritesComponent;
  let fixture: ComponentFixture<ScolaritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScolaritesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScolaritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
