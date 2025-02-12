import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalNavUserComponent } from './vertical-nav-user.component';

describe('VerticalNavUserComponent', () => {
  let component: VerticalNavUserComponent;
  let fixture: ComponentFixture<VerticalNavUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalNavUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalNavUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
