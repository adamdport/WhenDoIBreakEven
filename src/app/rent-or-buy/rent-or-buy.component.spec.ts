import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentOrBuyComponent } from './rent-or-buy.component';

describe('RentOrBuyComponent', () => {
  let component: RentOrBuyComponent;
  let fixture: ComponentFixture<RentOrBuyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentOrBuyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentOrBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
