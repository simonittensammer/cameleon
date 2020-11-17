import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamSelectionComponent } from './cam-selection.component';

describe('CamSelectionComponent', () => {
  let component: CamSelectionComponent;
  let fixture: ComponentFixture<CamSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CamSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
