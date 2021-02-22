import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateIssueComponent } from './modules/issues/create-issue/create-issue.component';
import { ProjectDataComponent } from './modules/issues/project-data/project-data.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { AuthGuard } from './modules/auth/auth.guard';
import { SubmittedIssueComponent } from './modules/issues/submitted-issue/submitted-issue.component';
import { IssueViewerComponent } from './modules/issues/issue-viewer/issue-viewer.component';


const routes: Routes = [
  {
    path: 'projects',
    component: ProjectDataComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create/:id',
    component: CreateIssueComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'submitted', component: SubmittedIssueComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'viewer', component: IssueViewerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
