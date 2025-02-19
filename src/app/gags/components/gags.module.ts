import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { AddGagComponentComponent } from "./addGagComponent/add-gag-component.component";
import { GagComponent } from "./mainPageComponent/gags.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CultureChoiceComponent } from './culture-choice/culture-choice.component'; 
import { AuthGuard } from '../../authentification/auth.guard';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
  {
    path: "",
    data: {
      title: "About",
      urls: [{ title: "jokes", url: "/jokes" }, { title: "jokes" }],
    },
    component: GagComponent,
  },
  { 
    path: "add",
    data: {
      title: "add",
      urls: [{ title: "add", url: "/add" }, { title: "add" }],
    },
    component: AddGagComponentComponent,
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(routes),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right', // Change position if needed
      timeOut: 3000,
    })
  ],
  declarations: [
    GagComponent,
    AddGagComponentComponent
  ],
})
export class GagModule {}
