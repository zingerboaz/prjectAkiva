import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicIndicesComponent } from './academic-indices.component';

describe('AcademicIndicesComponent', () => {
  let component: AcademicIndicesComponent;
  let fixture: ComponentFixture<AcademicIndicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicIndicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicIndicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
