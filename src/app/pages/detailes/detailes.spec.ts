import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detailes } from './detailes';

describe('Detailes', () => {
  let component: Detailes;
  let fixture: ComponentFixture<Detailes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detailes],
    }).compileComponents();

    fixture = TestBed.createComponent(Detailes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
