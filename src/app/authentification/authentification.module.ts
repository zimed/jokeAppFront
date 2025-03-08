import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { AuthentificationComponent } from "./authentification.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "authentication",
      urls: [{ title: "Authentification", url: "/login" }, { title: "authentification" }],
    },
    component: AuthentificationComponent,
  },
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
  ],
})
export class AuthentificationModule {}