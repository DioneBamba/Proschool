import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutEnseignantComponent } from './ajout-enseignant.component';

describe('AjoutEnseignantComponent', () => {
  let component: AjoutEnseignantComponent;
  let fixture: ComponentFixture<AjoutEnseignantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutEnseignantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutEnseignantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
