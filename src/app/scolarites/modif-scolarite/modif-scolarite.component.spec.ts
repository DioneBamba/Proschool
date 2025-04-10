import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifScolariteComponent } from './modif-scolarite.component';

describe('ModifScolariteComponent', () => {
  let component: ModifScolariteComponent;
  let fixture: ComponentFixture<ModifScolariteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifScolariteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifScolariteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
