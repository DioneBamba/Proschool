import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifEnseignantComponent } from './modif-enseignant.component';

describe('ModifEnseignantComponent', () => {
  let component: ModifEnseignantComponent;
  let fixture: ComponentFixture<ModifEnseignantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifEnseignantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifEnseignantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
