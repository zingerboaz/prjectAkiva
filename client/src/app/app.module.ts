import { CustomSelectComponent } from './components/costum-select/costum-select.component';
import { InstitutionGeneralInfoComponent } from './components/institution-general-info/institution-general-info.component';
import { ExpansionContentBarComponent } from './components/expansion-content-bar/expansion-content-bar.component';
import { ExpansionContentLineComponent } from './components/expansion-content-line/expansion-content-line.component';
import { ParticipationComponent } from './components/participation/participation.component';
import { CustomExpansionComponent } from './components/custom-expansion/custom-expansion.component';
import { ConclusionsComponent } from './components/conclusions/conclusions.component';
import { CalanderInputComponent } from './components/calander-input/calander-input.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { InstitutionYearGoalsComponent } from './components/institution-year-goals/institution-year-goals.component';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { AppRoutingModule } from './app-routing.module';
import { appStoreProviders } from './app.store';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { UserBarComponent } from './components/user-bar/user-bar.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { GeneralInfoComponent } from './components/general-info/general-info.component';
import { EducationalDataComponent } from './components/educational-data/educational-data.component';
import { YearGoalsComponent } from './components/year-goals/year-goals.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DefaultPageComponent } from './components/default-page/default-page.component';
import { AcademicIndicesComponent } from './components/academic-indices/academic-indices.component';
import { StaffIndexComponent } from './components/staff-index/staff-index.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { CookieModule } from 'ngx-cookie';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { InstitutionMainComponent } from './components/institution-main/institution-main.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { InstitutionLayoutComponent } from './components/institution-layout/institution-layout.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NoDataClassDirective } from './services/no-data-class.directive';
import { NewMainComponent } from './components/new-main/new-main.component';
import { InterfaceImageComponent } from './components/interface-image/interface-image.component';
import { YearGoalsDialogComponent } from './components/year-goals-dialog/year-goals-dialog.component';
import { InstituionYearGoalDialogComponent } from './components/instituion-year-goal-dialog/instituion-year-goal-dialog.component';
import { CustomInputDialogComponent } from './components/custom-input-dialog/custom-input-dialog.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CustomInputMultipleComponent } from './custom-input-multiple/custom-input-multiple.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    ChangePasswordComponent,
    SearchBarComponent,
    UserBarComponent,
    SearchBarComponent,
    GeneralInfoComponent,
    EducationalDataComponent,
    YearGoalsComponent,
    DefaultPageComponent,
    AcademicIndicesComponent,
    StaffIndexComponent,
    NavBarComponent,
    ForgotPasswordComponent,
    InstitutionYearGoalsComponent,
    InstitutionMainComponent,
    CustomInputComponent,
    CalanderInputComponent,
    ConclusionsComponent,
    CustomExpansionComponent,
    CustomSelectComponent,
    ParticipationComponent,
    ExpansionContentLineComponent,
    ExpansionContentBarComponent,
    InstitutionLayoutComponent,
    InstitutionGeneralInfoComponent,
    NoDataClassDirective,
    NewMainComponent,
    InterfaceImageComponent,
    YearGoalsDialogComponent,
    InstituionYearGoalDialogComponent,
    CustomInputDialogComponent,
    CustomInputMultipleComponent,

  ],
  imports: [
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    // MatAutocompleteModule,
    // MatButtonToggleModule,
    // MatTabsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // MatToolbarModule,
    // MatSelectModule,
    MatExpansionModule,
    MatCardModule,
    // MatCheckboxModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgSelectModule,
    MatProgressBarModule,
    CookieModule.forRoot(),
    MatTooltipModule
    // NgCircleProgressModule.forRoot({
    //   // set defaults here
    //   radius: 100,
    //   outerStrokeWidth: 16,
    //   innerStrokeWidth: 8,
    //   outerStrokeColor: '#78C000',
    //   innerStrokeColor: '#C7E596',
    //   animationDuration: 300,
    // }),
  ],
  providers: [
    appStoreProviders,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent],
  entryComponents: [YearGoalsDialogComponent]
})
export class AppModule {}
