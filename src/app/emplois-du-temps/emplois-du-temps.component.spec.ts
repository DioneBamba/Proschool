import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploisDuTempsComponent } from './emplois-du-temps.component';

describe('EmploisDuTempsComponent', () => {
  let component: EmploisDuTempsComponent;
  let fixture: ComponentFixture<EmploisDuTempsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploisDuTempsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmploisDuTempsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
