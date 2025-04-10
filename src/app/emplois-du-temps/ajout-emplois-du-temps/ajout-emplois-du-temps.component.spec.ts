import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutEmploisDuTempsComponent } from './ajout-emplois-du-temps.component';

describe('AjoutEmploisDuTempsComponent', () => {
  let component: AjoutEmploisDuTempsComponent;
  let fixture: ComponentFixture<AjoutEmploisDuTempsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutEmploisDuTempsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutEmploisDuTempsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
