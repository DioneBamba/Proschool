import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAnneeScolaireComponent } from './select-annee-scolaire.component';

describe('SelectAnneeScolaireComponent', () => {
  let component: SelectAnneeScolaireComponent;
  let fixture: ComponentFixture<SelectAnneeScolaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAnneeScolaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAnneeScolaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
