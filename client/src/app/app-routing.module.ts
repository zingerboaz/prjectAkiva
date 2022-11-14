import { NewMainComponent } from './components/new-main/new-main.component';
import {ConclusionsResolver} from './resolvers/conclusions.resolver';
import {YearGoalsResolver} from './resolvers/year-goals.resolver';
import {StaffIndexResolver} from './resolvers/staff-index.resolver';
import {ParticipationResolver} from './resolvers/participation.resolver';
import {AcademicIndicesResolver} from './resolvers/academic-indices.resolver';
import {EducationalDataResolver} from './resolvers/educational-data.resolver';
import {GeneralInfoResolver} from './resolvers/general-info.resolver';
import {ChooseInstitutionGuard} from './choose-institution.guard';
import {DefaultPageGuard} from './default-page.guard';
import {ConclusionsComponent} from './components/conclusions/conclusions.component';
import {InstitutionMainComponent} from './components/institution-main/institution-main.component';
import {InstitutionYearGoalsComponent} from './components/institution-year-goals/institution-year-goals.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './components/main/main.component';
import {LoginComponent} from './components/login/login.component';
import {ChangePasswordComponent} from './components/change-password/change-password.component';
import {LoggedInGuard} from './logged-in.guard';
import {GeneralInfoComponent} from './components/general-info/general-info.component';
import {YearGoalsComponent} from './components/year-goals/year-goals.component';
import {DefaultPageComponent} from './components/default-page/default-page.component';
import {EducationalDataComponent} from './components/educational-data/educational-data.component';
import {AcademicIndicesComponent} from './components/academic-indices/academic-indices.component';
import {StaffIndexComponent} from './components/staff-index/staff-index.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {ParticipationComponent} from './components/participation/participation.component';
import {InstitutionGeneralInfoComponent} from './components/institution-general-info/institution-general-info.component';
import {DataAvailableYearsGuard} from "./resolvers/data-available-years-guard.service";
import {DATA_TYPE_ROUTES, DataTypesEnum} from "./services/data-types.enum";

export const routes: Routes = [
  {
    path:'',
    redirectTo:'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [LoginPageGuard],
  },
  {
    path: 'manager',
    component: NewMainComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path:'',
        redirectTo:'default_page',
        pathMatch: 'full'
      },
      {
        path: 'default_page',
        component: DefaultPageComponent,
        canActivate: [DefaultPageGuard]
      },
    ]
  },{
    path: 'institution',
    component: NewMainComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path:'',
        redirectTo:'default_page',
        pathMatch: 'full'
      },
      {
        path: 'default_page',
        component: DefaultPageComponent,
        canActivate: [DefaultPageGuard]
      },
    ]
  },
  {
    path: 'manager/:institutionId/:yearName',
    component: NewMainComponent,
    canActivate: [LoggedInGuard],
    children: [

      {
        path: DATA_TYPE_ROUTES.get(DataTypesEnum.INSTITUTION_DETAILS),
        component: GeneralInfoComponent,
        resolve: {institutionData: GeneralInfoResolver},
        canActivate: [ChooseInstitutionGuard, DataAvailableYearsGuard]
      },
      {
        path: DATA_TYPE_ROUTES.get(DataTypesEnum.SOCIAL),
        component: EducationalDataComponent,
        resolve: {educationalData: EducationalDataResolver},
        canActivate: [ChooseInstitutionGuard, DataAvailableYearsGuard]

      },
      {
        path: DATA_TYPE_ROUTES.get(DataTypesEnum.EDUCATION),
        component: AcademicIndicesComponent,
        resolve: {academicsData: AcademicIndicesResolver},
        canActivate: [ChooseInstitutionGuard, DataAvailableYearsGuard]

      },
      {
        path: DATA_TYPE_ROUTES.get(DataTypesEnum.PARTICIPATION),
        component: ParticipationComponent,
        resolve: {participationData: ParticipationResolver},
        canActivate: [ChooseInstitutionGuard, DataAvailableYearsGuard]

      },
      {
        path: DATA_TYPE_ROUTES.get(DataTypesEnum.STAFF),
        component: StaffIndexComponent,
        resolve: {staffData: StaffIndexResolver},
        canActivate: [ChooseInstitutionGuard, DataAvailableYearsGuard]

      },
      {
        path: DATA_TYPE_ROUTES.get(DataTypesEnum.YEARLY_GOALS),
        component: YearGoalsComponent,
        resolve: {yearGoals: YearGoalsResolver},
        canActivate: [ChooseInstitutionGuard, DataAvailableYearsGuard]

      },
    ],
  },
  {
    path: 'institution/:institutionId/:yearName',
    component: InstitutionMainComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: '',
        redirectTo: 'general-info',
        pathMatch: 'full',
      },

      {
        path: DATA_TYPE_ROUTES.get(DataTypesEnum.INSTITUTION_DETAILS),
        component: InstitutionGeneralInfoComponent,
        resolve: {institutionData: GeneralInfoResolver},
        canActivate: [DataAvailableYearsGuard]
      },
      {
        path:  DATA_TYPE_ROUTES.get(DataTypesEnum.SOCIAL),
        component: EducationalDataComponent,
        resolve: {educationalData: EducationalDataResolver},
        canActivate: [DataAvailableYearsGuard]
      },
      {
        path:  DATA_TYPE_ROUTES.get(DataTypesEnum.EDUCATION),
        component: AcademicIndicesComponent,
        resolve: {academicsData: AcademicIndicesResolver},
        canActivate: [DataAvailableYearsGuard]
      },
      {
        path: DATA_TYPE_ROUTES.get(DataTypesEnum.PARTICIPATION),
        component: ParticipationComponent,
        resolve: {participationData: ParticipationResolver},
        canActivate: [DataAvailableYearsGuard]

      },
      {
        path: DATA_TYPE_ROUTES.get(DataTypesEnum.STAFF),
        component: StaffIndexComponent,
        resolve: {staffData: StaffIndexResolver},
        canActivate: [DataAvailableYearsGuard]

      },
      {
        path: DATA_TYPE_ROUTES.get(DataTypesEnum.YEARLY_GOALS),
        component: InstitutionYearGoalsComponent,
        resolve: {yearGoals: YearGoalsResolver},
        canActivate: [DataAvailableYearsGuard]

      },
      {
        path: 'conclusions',
        component: ConclusionsComponent,
        resolve: {conclusions: ConclusionsResolver},
//        canActivate: [DataAvailableYearsGuard]
      },
    ],
  },
  {
    path: 'change_password',
    component: ChangePasswordComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'forgot_password',
    component: ForgotPasswordComponent,
    // canActivate: [LoginPageGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
