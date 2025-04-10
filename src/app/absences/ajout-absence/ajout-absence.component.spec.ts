import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutAbsenceComponent } from './ajout-absence.component';

describe('AjoutAbsenceComponent', () => {
  let component: AjoutAbsenceComponent;
  let fixture: ComponentFixture<AjoutAbsenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutAbsenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
