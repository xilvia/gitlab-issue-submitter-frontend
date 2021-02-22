import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueViewerComponent } from './issue-viewer.component';

describe('IssueViewerComponent', () => {
  let component: IssueViewerComponent;
  let fixture: ComponentFixture<IssueViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
