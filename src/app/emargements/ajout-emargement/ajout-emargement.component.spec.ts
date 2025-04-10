import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutEmargementComponent } from './ajout-emargement.component';

describe('AjoutEmargementComponent', () => {
  let component: AjoutEmargementComponent;
  let fixture: ComponentFixture<AjoutEmargementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutEmargementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutEmargementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
