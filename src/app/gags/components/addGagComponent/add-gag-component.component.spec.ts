import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGagComponentComponent } from './add-gag-component.component';

describe('AddGagComponentComponent', () => {
  let component: AddGagComponentComponent;
  let fixture: ComponentFixture<AddGagComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddGagComponentComponent]
    });
    fixture = TestBed.createComponent(AddGagComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
