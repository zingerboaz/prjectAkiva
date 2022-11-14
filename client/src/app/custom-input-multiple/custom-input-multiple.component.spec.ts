import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomInputMultipleComponent } from './custom-input-multiple.component';

describe('CustomInputMultipleComponent', () => {
  let component: CustomInputMultipleComponent;
  let fixture: ComponentFixture<CustomInputMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomInputMultipleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomInputMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
