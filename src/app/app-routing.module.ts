import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonListComponent } from './components/person-list/person-list.component';
import { PersonFormComponent } from './components/person-form/person-form.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { CompetitionListComponent } from './components/competition-list/competition-list.component';
import { PersonComponent } from './components/person/person.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Normal User Flow
  { path: 'login', component: LoginComponent },
  { path: 'register', component: PersonFormComponent, data: { mode: 'register' } },
  { path: 'complete-profile', component: PersonFormComponent, data: { mode: 'profileCompletion' } },  // ✅ added here

  // Admin Flow
  {
    path: 'admin',
    component: DashboardComponent,
    children: [
      { path: 'persons', component: PersonListComponent },
      {
        path: 'person/:id',
        component: PersonComponent,
        children: [
          { path: 'profile', component: ProfileComponent },
          { path: 'documents', component: DocumentListComponent },
          { path: 'competitions', component: CompetitionListComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
