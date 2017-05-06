import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeCalculatorComponent } from './college-calculator.component';

describe('CollegeCalculatorComponent', () => {
  let component: CollegeCalculatorComponent;
  let fixture: ComponentFixture<CollegeCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollegeCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegeCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
