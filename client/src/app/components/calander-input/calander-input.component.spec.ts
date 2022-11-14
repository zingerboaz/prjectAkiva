/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CalanderInputComponent } from './calander-input.component';

describe('CalanderInputComponent', () => {
  let component: CalanderInputComponent;
  let fixture: ComponentFixture<CalanderInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalanderInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalanderInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
