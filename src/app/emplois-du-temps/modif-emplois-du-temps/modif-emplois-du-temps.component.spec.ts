import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifEmploisDuTempsComponent } from './modif-emplois-du-temps.component';

describe('ModifEmploisDuTempsComponent', () => {
  let component: ModifEmploisDuTempsComponent;
  let fixture: ComponentFixture<ModifEmploisDuTempsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifEmploisDuTempsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifEmploisDuTempsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


