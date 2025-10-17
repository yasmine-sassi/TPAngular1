import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CvComponent } from './cv.component';
import { LoggerService } from '../../services/logger.service';
import { ToastrService } from 'ngx-toastr';
import { CvService } from '../services/cv.service';
import { of } from 'rxjs';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cv } from '../model/cv';

// Mock child components
@Component({selector: 'app-list', template: ''})
class MockListComponent {
  @Input() cvs: Cv[] | null = [];
  @Output() selectCvEvent = new EventEmitter<Cv>();
}

@Component({selector: 'app-cv-card', template: ''})
class MockCvCardComponent {
  @Input() cv: Cv | null = null;
}

@Component({selector: 'app-embauche', template: ''})
class MockEmbaucheComponent {}

describe('CvComponent', () => {
  let component: CvComponent;
  let fixture: ComponentFixture<CvComponent>;

  const mockCvService = {
    getCvs: () => of([]),
    selectCv$: of(null),
    getFakeCvs: () => [],
    selectCv: (cv: Cv) => {}
  };

  const mockLogger = { logger: (msg: string) => {} };
  const mockToastr = { info: (msg: string) => {}, error: (msg: string) => {} };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CvComponent,
        MockListComponent,
        MockCvCardComponent,
        MockEmbaucheComponent
      ],
      providers: [
        { provide: CvService, useValue: mockCvService },
        { provide: LoggerService, useValue: mockLogger },
        { provide: ToastrService, useValue: mockToastr }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
