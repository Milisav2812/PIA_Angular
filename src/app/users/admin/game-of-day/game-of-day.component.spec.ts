import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOfDayComponent } from './game-of-day.component';

describe('GameOfDayComponent', () => {
  let component: GameOfDayComponent;
  let fixture: ComponentFixture<GameOfDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameOfDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameOfDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
