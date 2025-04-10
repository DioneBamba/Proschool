import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutNoteComponent } from './ajout-note.component';

describe('AjoutNoteComponent', () => {
  let component: AjoutNoteComponent;
  let fixture: ComponentFixture<AjoutNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutNoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
