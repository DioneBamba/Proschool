import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliothequesComponent } from './bibliotheques.component';

describe('BibliothequesComponent', () => {
  let component: BibliothequesComponent;
  let fixture: ComponentFixture<BibliothequesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibliothequesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibliothequesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
