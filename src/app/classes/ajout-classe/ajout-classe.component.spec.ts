import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutClasseComponent } from './ajout-classe.component';

describe('AjoutClasseComponent', () => {
  let component: AjoutClasseComponent;
  let fixture: ComponentFixture<AjoutClasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutClasseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
