import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearGoalsComponent } from './year-goals.component';

describe('YearGoalsComponent', () => {
  let component: YearGoalsComponent;
  let fixture: ComponentFixture<YearGoalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearGoalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
