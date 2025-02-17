import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { AuthGuard } from './authentification/auth.guard';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full',  },
      {
        path: 'login',
        loadChildren: () => import('./authentification/authentification.module').then(m => m.AuthentificationModule)
      },
      {
        path: 'jokes',
        loadChildren: () => import('./gags/components/gags.module').then(m => m.GagModule),
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/starter'
  }
];
