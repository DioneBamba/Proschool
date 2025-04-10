import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutMatiereComponent } from './ajout-matiere.component';

describe('AjoutMatiereComponent', () => {
  let component: AjoutMatiereComponent;
  let fixture: ComponentFixture<AjoutMatiereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutMatiereComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutMatiereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
