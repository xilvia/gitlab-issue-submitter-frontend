import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-language',
  template: `
    <span class="form-inline">
      <select
        class="form-control lang"
        #selectedLang
        (change)="switchLang(selectedLang.value)"
      >
        <option
          *ngFor="let language of translate.getLangs()"
          class="suggests"
          [value]="language"
          [selected]="language === translate.currentLang"
        >
          {{ language }}
        </option>
      </select>
    </span>
  `,
  styleUrls: ['./select-language.component.css'],
})
export class SelectLanguageComponent implements OnInit {
  constructor(public translate: TranslateService) {}

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit(): void {}
}
