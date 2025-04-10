import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifAbsenceComponent } from './modif-absence.component';

describe('ModifAbsenceComponent', () => {
  let component: ModifAbsenceComponent;
  let fixture: ComponentFixture<ModifAbsenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifAbsenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
