import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveOrUberComponent } from './drive-or-uber.component';

describe('DriveOrUberComponent', () => {
  let component: DriveOrUberComponent;
  let fixture: ComponentFixture<DriveOrUberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriveOrUberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriveOrUberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
