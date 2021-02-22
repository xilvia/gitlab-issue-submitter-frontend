import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { ProjectDataService } from '../service/project-data.service';

@Component({
  selector: 'app-issue-viewer',
  templateUrl: './issue-viewer.component.html',
  styleUrls: ['./issue-viewer.component.css'],
})
export class IssueViewerComponent implements OnInit {
  assignee: string;
  assigneeAvatar: string = localStorage.getItem('assigneeAvatar');
  assigneeUsername: string = localStorage.getItem('assigneeUsername');
  description: string;
  identicon: string;
  issueId: string;
  issueLabels: any;
  issueLabelsArr = [];
  projectName = localStorage.getItem('projectName');
  projectId = JSON.parse(localStorage.getItem('projectId'));
  projectDescription = JSON.parse(localStorage.getItem('projectDescription'));
  projectAvatar: string;
  title: string;
  username = JSON.parse(localStorage.getItem('username'));

  @ViewChild('elseSection') elseSection: TemplateRef<any>;

  constructor(
    private router: Router,
    public translate: TranslateService,
    private projectDataService: ProjectDataService
  ) {}

  ngOnInit(): void {
    const issueObj = JSON.parse(localStorage.getItem('issueDetails'));
    (this.issueId = issueObj.issueId),
      (this.title = issueObj.title),
      (this.description = issueObj.description),
      (this.assignee = issueObj.assignee),
      (this.issueLabels = Array.from(issueObj.labels));

    this.getOneProject(this.projectId);
    this.getAllProjectLabels(this.projectId);
  }

  getAllProjectLabels(projectId): any {
    this.projectDataService.getLabels(projectId).subscribe((allLabels) => {
      this.saveAllLabels(allLabels, this.issueLabels);
    });
  }

  saveAllLabels(allLabels, labels): any {
    labels[0].forEach((element) => {
      for (const value of allLabels) {
        if (value['name'] === element) {
          this.makeIssueLabelsArr(value);
        }
      }
    });
  }

  makeIssueLabelsArr(obj): any {
    this.issueLabelsArr.push(obj);
  }

  getOneProject(id: number): BehaviorSubject<any> {
    this.projectDataService.getOneProject(id).subscribe((project) => {
      this.projectAvatar = project.avatar_url;
      this.identicon = this.projectName.charAt(0).toUpperCase();
    });
    return;
  }

  get identiconClass(): any {
    if (this.projectAvatar === null && this.projectId % 7 === 0) {
      return 'project-data identicon bg1';
    }
    if (this.projectAvatar === null && this.projectId % 7 === 1) {
      return 'project-data identicon bg2';
    }
    if (this.projectAvatar === null && this.projectId % 7 === 2) {
      return 'project-data identicon bg3';
    }
    if (this.projectAvatar === null && this.projectId % 7 === 3) {
      return 'project-data identicon bg4';
    }
    if (this.projectAvatar === null && this.projectId % 7 === 4) {
      return 'project-data identicon bg5';
    }
    if (this.projectAvatar === null && this.projectId % 7 === 5) {
      return 'project-data identicon bg6';
    }
    if (this.projectAvatar === null && this.projectId % 7 === 6) {
      return 'project-data identicon bg7';
    }
  }

  backToSubmittedIssuePage(): any {
    this.router.navigate(['/submitted']);
  }
}
