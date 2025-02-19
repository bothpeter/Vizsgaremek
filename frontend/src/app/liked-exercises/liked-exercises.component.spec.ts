import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedExercisesComponent } from './liked-exercises.component';

describe('LikedExercisesComponent', () => {
  let component: LikedExercisesComponent;
  let fixture: ComponentFixture<LikedExercisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikedExercisesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikedExercisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
