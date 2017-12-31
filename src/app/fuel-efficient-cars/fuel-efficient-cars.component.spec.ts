import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelEfficientCarsComponent } from './fuel-efficient-cars.component';

describe('FuelEfficientCarsComponent', () => {
  let component: FuelEfficientCarsComponent;
  let fixture: ComponentFixture<FuelEfficientCarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelEfficientCarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelEfficientCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
