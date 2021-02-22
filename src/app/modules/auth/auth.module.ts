import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './service/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';



@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  providers: [AuthService, TranslateService],
})
export class AuthModule { }
