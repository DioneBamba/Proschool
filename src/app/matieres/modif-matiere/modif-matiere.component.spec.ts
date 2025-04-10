import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifMatiereComponent } from './modif-matiere.component';

describe('ModifMatiereComponent', () => {
  let component: ModifMatiereComponent;
  let fixture: ComponentFixture<ModifMatiereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifMatiereComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifMatiereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
