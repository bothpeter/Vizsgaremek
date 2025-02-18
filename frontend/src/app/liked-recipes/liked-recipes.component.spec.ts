import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedRecipesComponent } from './liked-recipes.component';

describe('LikedRecipesComponent', () => {
  let component: LikedRecipesComponent;
  let fixture: ComponentFixture<LikedRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikedRecipesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikedRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
