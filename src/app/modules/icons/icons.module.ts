import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { ArrowLeft, Lock, Unlock, CheckCircle, LogOut, Search } from 'angular-feather/icons';

const icons = {
  ArrowLeft,
  Lock,
  Unlock,
  CheckCircle,
  LogOut,
  Search
};

@NgModule({
  imports: [FeatherModule.pick(icons)],
  exports: [FeatherModule],
})
export class IconsModule { }
