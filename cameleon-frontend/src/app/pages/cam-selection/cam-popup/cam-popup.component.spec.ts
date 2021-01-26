import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamPopupComponent } from './cam-popup.component';

describe('CamPopupComponent', () => {
  let component: CamPopupComponent;
  let fixture: ComponentFixture<CamPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CamPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
