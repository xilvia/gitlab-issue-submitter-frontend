import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-submitted-issue',
  templateUrl: './submitted-issue.component.html',
  styleUrls: ['./submitted-issue.component.css'],
})
export class SubmittedIssueComponent implements OnInit {
  issueId;

  constructor(private router: Router,
    public translate: TranslateService
    ) { }

  ngOnInit(): void {
    const issueObj = JSON.parse(localStorage.getItem('issueDetails'));
    this.issueId = issueObj.issueId;

  }

  viewIssue(): any {
    this.router.navigate(['/viewer']);
  }

  submitNewIssue(): any {
    this.router.navigate(['/projects']);
    localStorage.removeItem('projectName');
    localStorage.removeItem('projectAvatar');
    localStorage.removeItem('projectId');
    localStorage.removeItem('identicon');
    localStorage.removeItem('issueDetails');
    localStorage.removeItem('issueId');
  }
}
