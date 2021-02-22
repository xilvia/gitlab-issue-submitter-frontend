import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedIssueComponent } from './submitted-issue.component';

describe('SubmittedIssueComponent', () => {
  let component: SubmittedIssueComponent;
  let fixture: ComponentFixture<SubmittedIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmittedIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittedIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
