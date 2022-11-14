import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalDataComponent } from './educational-data.component';

describe('EducationalDataComponent', () => {
  let component: EducationalDataComponent;
  let fixture: ComponentFixture<EducationalDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationalDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
