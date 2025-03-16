import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { AddGagComponentComponent } from "./addGagComponent/add-gag-component.component";
import { GagComponent } from "./mainPageComponent/gags.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CultureChoiceComponent } from './culture-choice/culture-choice.component'; 
import { AuthGuard } from '../../authentification/auth.guard';
import { SingleGagComponent } from './single-gag/single-gag.component';


const routes: Routes = [
  {
    path: "",
    data: {
      title: "posts",
      urls: [{ title: "posts", url: "/posts" }, { title: "posts" }],
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
  },
  {
    path: ":id",
    data: {
      title: "post",
      urls: [{ title: "post", url: "/:id" }, { title: "post" }],
    },
    component: SingleGagComponent,
  },
  {
    path: "user/:username",
    data: {
      title: "postByUser",
      urls: [{ title: "userPosts", url: "/user/:username" }, { title: "posts" }],
    },
    component: GagComponent,
  }
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    GagComponent,
    AddGagComponentComponent,
    SingleGagComponent
  ],
})
export class GagModule {}
