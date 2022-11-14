import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceImageComponent } from './interface-image.component';

describe('InterfaceImageComponent', () => {
  let component: InterfaceImageComponent;
  let fixture: ComponentFixture<InterfaceImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfaceImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
