import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsEmploisDuTempsComponent } from './details-emplois-du-temps.component';

describe('DetailsEmploisDuTempsComponent', () => {
  let component: DetailsEmploisDuTempsComponent;
  let fixture: ComponentFixture<DetailsEmploisDuTempsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsEmploisDuTempsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsEmploisDuTempsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
