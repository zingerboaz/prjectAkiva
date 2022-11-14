import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearGoalsDialogComponent } from './year-goals-dialog.component';

describe('YearGoalsDialogComponent', () => {
  let component: YearGoalsDialogComponent;
  let fixture: ComponentFixture<YearGoalsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearGoalsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearGoalsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
