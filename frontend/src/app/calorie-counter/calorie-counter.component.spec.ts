import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalorieCounterComponent } from './calorie-counter.component';

describe('CalorieCounterComponent', () => {
  let component: CalorieCounterComponent;
  let fixture: ComponentFixture<CalorieCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalorieCounterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalorieCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
