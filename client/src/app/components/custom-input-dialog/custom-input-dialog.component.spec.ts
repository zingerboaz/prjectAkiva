import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomInputDialogComponent } from './custom-input-dialog.component';

describe('CustomInputDialogComponent', () => {
  let component: CustomInputDialogComponent;
  let fixture: ComponentFixture<CustomInputDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomInputDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
