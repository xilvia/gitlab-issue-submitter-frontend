import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
  TemplateRef,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { ProjectDataService } from '../service/project-data.service';
import { IssueDto } from '../dto/issue.dto';
import { map, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-create-issue',
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.css'],
})
export class CreateIssueComponent implements OnInit {
  assignees$: Observable<any[]>;
  clickedAssignee: any;
  clickedLabel: any;
  descArr = [];
  identicon: string;
  isSearchAssigneesActive = false;
  isSearchLabelsActive = false;
  issueSubmitter: FormGroup;
  labels$: Observable<any[]>;
  projectAvatar: any;
  projectDescription: any;
  projectId: number;
  projectName: any;
  selectedAssignees = [];
  selectedLabels = [];
  username = JSON.parse(localStorage.getItem('username'));

  @ViewChild('elseSection') elseSection: TemplateRef<any>;
  @ViewChild('fakeInputLabel') fakeInputLabel: ElementRef;
  @ViewChild('fakeInputAssignee') fakeInputAssignee: ElementRef;
  @ViewChild('inputAssignee') inputAssignee: ElementRef;
  @ViewChild('inputLabel') inputLabel: ElementRef;
  @ViewChild('jumbotron') jumbotron: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private projectDataService: ProjectDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.issueSubmitter = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(50)]],
      description: ['', [Validators.required, Validators.minLength(200)]],
      assignee: ['', [Validators.required]],
      label: [],
    });

    this.activatedRoute.paramMap.subscribe((params) => {
      this.projectId = +params.get('id');
      localStorage.setItem('projectId', JSON.stringify(this.projectId));
      this.getOneProject(this.projectId);
    });
  }

  get title(): any {
    return this.issueSubmitter.get('title');
  }

  get description(): any {
    return this.issueSubmitter.get('description');
  }

  get assignee(): any {
    return this.issueSubmitter.get('assignee');
  }

  get label(): any {
    return this.issueSubmitter.get('label');
  }

  onSubmit(): void {
    if (this.issueSubmitter.valid) {
      this.convertToDto(this.issueSubmitter.value);
      this.issueSubmitter.reset();
    }
  }

  searchAssignees = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(() => {
        this.assignees$ = this.projectDataService.getAssignees(this.projectId);
        return combineLatest([this.assignees$, text$]).pipe(
          map(([assignees, term]) =>
            assignees.filter((assignee) =>
              assignee.name.toLowerCase().includes(term.toLowerCase()),
              catchError(error => {
                console.log(`search error: ${error}`);
                return of({ results: null });
              })
            )
          )
        );
      })
    );

  selectedAssignee(item): any {
    this.clickedAssignee = item.item;
    this.renderer.setProperty(
      this.fakeInputAssignee.nativeElement,
      'value',
      this.clickedAssignee.name
    );
    this.selectedAssignees.push(this.clickedAssignee);
  }

  resultFormatAssigneeListValue(value: any): any {
    return value.name;
  }

  inputFormatAssigneeListValue(...value: any): any {
    return value.name;
  }

  searchLabels = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(() => {
        this.labels$ = this.projectDataService.getLabels(this.projectId);
        return combineLatest([this.labels$, text$]).pipe(
          map(([labels, term]) =>
            labels.filter((label) =>
              label.name.toLowerCase().includes(term.toLowerCase()),
              catchError(error => {
                console.log(`search error: ${ error }`);
                return of({ results: null });
              })
            )
          )
        );
      })
    );

  selectedLabel(item): any {
    this.clickedLabel = item.item;
    this.selectedLabels.map((el) =>
      el === this.clickedLabel.name
        ? this.selectedLabels.splice(this.selectedLabels.indexOf(el), 1)
        : ''
    );
    this.selectedLabels.push(this.clickedLabel.name);
    this.renderLabels(this.selectedLabels);
  }

  renderLabels(selectedLabels): any {
    let labels = selectedLabels.map((el) => el);
    this.renderer.setProperty(
      this.fakeInputLabel.nativeElement,
      'value',
      labels.join(', ')
    );
    this.renderer.listen(
      this.fakeInputLabel.nativeElement,
      'keyup',
      (event) => {
        labels = this.fakeInputLabel.nativeElement.value;
        event.key === 'Backspace' || event.key === 'Delete'
          ? this.findDeletedString(labels)
          : '';
      }
    );
  }

  findDeletedString(labels): any {
    labels = [labels][0].split(', ');
    const labelsArr = Array.from(labels);

    this.selectedLabels.forEach((element1, index1) => {
      if (typeof element1 === 'string') {
        labelsArr.forEach((element2, index2) => {
          if (typeof element2 === 'string') {
            if (index1 === index2 && element1.length !== element2.length) {
              this.selectedLabels.splice(
                this.selectedLabels.indexOf(element1),
                1
              );
              labelsArr.splice(labelsArr.indexOf(element2), 1);
              this.renderLabels(this.selectedLabels);
            }
          }
        });
      }
    });
  }

  clickOutsideListener(): any {
    if (!this.fakeInputAssignee.nativeElement.contains(event.target)) {
      this.isSearchAssigneesActive = false;
    }
    if (
      this.inputAssignee.nativeElement.contains(event.target) ||
      this.fakeInputAssignee.nativeElement.contains(event.target)
    ) {
      this.isSearchAssigneesActive = true;
      this.setCursorAssignee();
    }
    if (!this.fakeInputLabel.nativeElement.contains(event.target)) {
      this.isSearchLabelsActive = false;
    }
    if (
      this.inputLabel.nativeElement.contains(event.target) ||
      this.fakeInputLabel.nativeElement.contains(event.target)
    ) {
      this.isSearchLabelsActive = true;
      this.setCursorLabel();
    }
  }

  setCursorAssignee(): any {
    setTimeout(() => {
      this.inputAssignee.nativeElement.focus();
      this.inputAssignee.nativeElement.select();
    }, 1000);
  }

  setCursorLabel(): any {
    setTimeout(() => {
      this.inputLabel.nativeElement.focus();
      this.inputLabel.nativeElement.select();
    }, 4000);
  }

  resultFormatLabelsListValue(value: any): any {
    return value;
  }

  inputFormatLabelsListValue(...value: any): any {
    return value.name;
  }

  convertToDto(obj): any {
    const dtoObj = {
      title: '',
      description: '',
      assignee_ids: null,
      labels: null,
    };

    const values = Object.keys(obj).map((key) => obj[key]);
    const title = values[0];
    const description = values[1];
    const assignee_ids = this.selectedAssignees[0]['id'];
    const labels = this.selectedLabels.map((el) => el) || this.selectedLabels;

    localStorage.setItem(
      'assigneeAvatar',
      this.selectedAssignees[0]['avatar_url']
    );
    localStorage.setItem(
      'assigneeUsername',
      this.selectedAssignees[0]['username']
    );

    dtoObj.title = title;
    dtoObj.description = description;
    dtoObj.assignee_ids = [assignee_ids];
    dtoObj.labels = labels;

    this.createIssue(dtoObj, this.projectId);

    return dtoObj;
  }

  createIssue(issueDto: IssueDto, id): BehaviorSubject<any> {
    id = this.projectId;
    this.projectDataService.createIssue(issueDto, id).subscribe((issue) => {
      this.getIssueDetails(issue);
      this.router.navigate(['/submitted']);
    });
    return;
  }

  getIssueDetails(obj): any {
    const responseObj = {
      issueId: obj.iid,
      title: obj.title,
      description: obj.description,
      assignee: obj.assignee.name,
      labels: [obj.labels],
    };
    localStorage.setItem('issueDetails', JSON.stringify(responseObj));
    return responseObj;
  }

  getOneProject(id: number): BehaviorSubject<any> {
    this.projectDataService.getOneProject(id).subscribe((project) => {
      this.projectName = project.name;
      this.projectAvatar = project.avatar_url;
      this.identicon = project.name.charAt(0).toUpperCase();
      this.projectDescription = project.description;
      this.descArr.push(this.projectDescription);

      localStorage.setItem('projectName', this.projectName);
      localStorage.setItem('projectDescription', JSON.stringify(this.descArr));
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

  selectProjectPage(): any {
    this.router.navigate(['/projects']);
    localStorage.removeItem('assigneeAvatar');
    localStorage.removeItem('assigneeUsername');
    localStorage.removeItem('identicon');
    localStorage.removeItem('issueDetails');
    localStorage.removeItem('projectAvatar');
    localStorage.removeItem('projectId');
    localStorage.removeItem('projectName');
  }
}
