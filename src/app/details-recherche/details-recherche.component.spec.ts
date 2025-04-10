import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsRechercheComponent } from './details-recherche.component';

describe('DetailsRechercheComponent', () => {
  let component: DetailsRechercheComponent;
  let fixture: ComponentFixture<DetailsRechercheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsRechercheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsRechercheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
