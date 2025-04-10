import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutAnneeScolaireComponent } from './ajout-annee-scolaire.component';

describe('AjoutAnneeScolaireComponent', () => {
  let component: AjoutAnneeScolaireComponent;
  let fixture: ComponentFixture<AjoutAnneeScolaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutAnneeScolaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutAnneeScolaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
