import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CultureChoiceComponent } from './culture-choice.component';

describe('CultureChoiceComponent', () => {
  let component: CultureChoiceComponent;
  let fixture: ComponentFixture<CultureChoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CultureChoiceComponent]
    });
    fixture = TestBed.createComponent(CultureChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
