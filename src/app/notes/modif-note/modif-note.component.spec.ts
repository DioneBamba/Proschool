import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifNoteComponent } from './modif-note.component';

describe('ModifNoteComponent', () => {
  let component: ModifNoteComponent;
  let fixture: ComponentFixture<ModifNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifNoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
