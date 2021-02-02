import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayEditorComponent } from './overlay-editor.component';

describe('OverlayEditorComponent', () => {
  let component: OverlayEditorComponent;
  let fixture: ComponentFixture<OverlayEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverlayEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
