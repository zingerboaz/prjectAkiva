import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffIndexComponent } from './staff-index.component';

describe('StaffIndexComponent', () => {
  let component: StaffIndexComponent;
  let fixture: ComponentFixture<StaffIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
