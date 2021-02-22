import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IssueDto } from '../dto/issue.dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectDataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserInfo(username: string): BehaviorSubject<any> {
    return this.http.get(
      `${this.apiUrl}/users?username=${username}`
    ) as BehaviorSubject<any>;
  }

  getUsersProjects(userId: number): BehaviorSubject<any> {
    return this.http.get(
      `${this.apiUrl}/users/${userId}/projects`
    ) as BehaviorSubject<any>;
  }

  getOneProject(id: number): BehaviorSubject<any> {
    return this.http.get(
      `${this.apiUrl}/projects/${id}`
    ) as BehaviorSubject<any>;
  }

  getAssignees(id: number): BehaviorSubject<any> {
    return this.http.get(
      `${this.apiUrl}/projects/${id}/users`
    ) as BehaviorSubject<any>;
  }

  getLabels(id: number): BehaviorSubject<any> {
    return this.http.get(
      `${this.apiUrl}/projects/${id}/labels`
    ) as BehaviorSubject<any>;
  }

  createIssue(issueDto: IssueDto, id: number): BehaviorSubject<IssueDto> {
    return this.http.post<IssueDto>(
      `${this.apiUrl}/projects/${id}/issues`,
      issueDto
    ) as BehaviorSubject<IssueDto>;
  }
}
