import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituionYearGoalDialogComponent } from './instituion-year-goal-dialog.component';

describe('InstituionYearGoalDialogComponent', () => {
  let component: InstituionYearGoalDialogComponent;
  let fixture: ComponentFixture<InstituionYearGoalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstituionYearGoalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstituionYearGoalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
