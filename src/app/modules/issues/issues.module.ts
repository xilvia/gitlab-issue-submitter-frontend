import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProjectDataComponent } from './project-data/project-data.component';
import { CreateIssueComponent } from './create-issue/create-issue.component';
import { ProjectDataService } from './service/project-data.service';
import { IconsModule } from '../icons/icons.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SubmittedIssueComponent } from './submitted-issue/submitted-issue.component';
import { IssueViewerComponent } from './issue-viewer/issue-viewer.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [ProjectDataComponent, CreateIssueComponent, SubmittedIssueComponent, IssueViewerComponent],
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    IconsModule,
    NgbTypeaheadModule,
    TranslateModule
  ],
  providers: [ProjectDataService, TranslateService]
})
export class IssuesModule { }
