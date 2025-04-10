import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutScolariteComponent } from './ajout-scolarite.component';

describe('AjoutScolariteComponent', () => {
  let component: AjoutScolariteComponent;
  let fixture: ComponentFixture<AjoutScolariteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutScolariteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutScolariteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
