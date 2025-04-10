import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifEmargementComponent } from './modif-emargement.component';

describe('ModifEmargementComponent', () => {
  let component: ModifEmargementComponent;
  let fixture: ComponentFixture<ModifEmargementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifEmargementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifEmargementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
