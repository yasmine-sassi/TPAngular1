import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterdetailcvComponent } from './masterdetailcv.component';

describe('MasterdetailcvComponent', () => {
  let component: MasterdetailcvComponent;
  let fixture: ComponentFixture<MasterdetailcvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterdetailcvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterdetailcvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
