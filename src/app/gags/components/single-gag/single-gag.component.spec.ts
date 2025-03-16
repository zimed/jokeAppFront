import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleGagComponent } from './single-gag.component';

describe('SingleGagComponent', () => {
  let component: SingleGagComponent;
  let fixture: ComponentFixture<SingleGagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleGagComponent]
    });
    fixture = TestBed.createComponent(SingleGagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
