import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
  distinctUntilChanged,
  debounceTime,
  switchMap,
  map,
} from 'rxjs/operators';
import { ProjectDataService } from '../service/project-data.service';
import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-project-data',
  templateUrl: './project-data.component.html',
  styleUrls: ['./project-data.component.css'],
})
export class ProjectDataComponent implements OnInit {
  clickedProject: any;
  model: any;
  projectAvatar: string;
  projectDescription: string;
  projectId: number;
  userId: number;
  username = JSON.parse(localStorage.getItem('username'));
  usersProjects$: Observable<any[]>;

  @ViewChild('elseSection') elseSection: TemplateRef<any>;

  constructor(
    private projectDataService: ProjectDataService,
    private router: Router,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getUserInfo(this.username);
  }

  getUserInfo(username): BehaviorSubject<any> {
    username = JSON.parse(localStorage.getItem('username'));
    console.log(username);
    this.projectDataService.getUserInfo(username).subscribe((userInfo) => {
      localStorage.setItem('userId', JSON.stringify(userInfo[0].id));
      this.userId = JSON.parse(localStorage.getItem('userId'));
    });
    return;
  }

  searchProject = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(() => {
        this.usersProjects$ = this.projectDataService.getUsersProjects(
          this.userId
        );
        return combineLatest([this.usersProjects$, text$]).pipe(
          map(([projects, term]) =>
            projects.filter((project) =>
              project.name.toLowerCase().includes(term.toLowerCase()),
              catchError(error => {
                console.log(`search error: ${ error }`);
                return of({ results: null });
              })
            )
          )
        );
      })
    );

  selectedProject(item): any {
    this.clickedProject = item.item;
  }

  resultFormatListValue(value: any): any {
    return value.name;
  }

  inputFormatListValue(value: any): any {
    return value.name;
  }

  getProjectId(id): BehaviorSubject<any> {
    const projectId = id;
    this.router.navigate(['/create', projectId]);
    return;
  }

  getIdenticonClass(id, url): any {
    if (url === null && id % 7 === 0) {
      return 'search search-suggests identicon bg1';
    }
    if (url === null && id % 7 === 1) {
      return 'search search-suggests identicon bg2';
    }
    if (url === null && id % 7 === 2) {
      return 'search search-suggests identicon bg3';
    }
    if (url === null && id % 7 === 3) {
      return 'search search-suggests identicon bg4';
    }
    if (url === null && id % 7 === 4) {
      return 'search search-suggests identicon bg5';
    }
    if (url === null && id % 7 === 5) {
      return 'search search-suggests identicon bg6';
    }
    if (url === null && id % 7 === 6) {
      return 'search search-suggests identicon bg7';
    }
  }
}
