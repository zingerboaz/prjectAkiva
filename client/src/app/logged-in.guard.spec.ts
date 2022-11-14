import { TestBed, tick, inject, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { LoggedInGuard } from './logged-in.guard';
import {
  HttpTestingController,
  HttpClientTestingModule
} from "@angular/common/http/testing";

import { environment } from '../environments/environment'
import { expectURL } from './shared/testUtils'
import { routes } from './app-routing.module'
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import {Location} from "@angular/common";
import { AppComponent } from './app.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  appStoreProviders,
} from './app.store';


describe('LoggedInGuard', () => {
  let guard: LoggedInGuard;
  let router: Router;
  let location: Location;
  let svc: AuthService;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes)],
      providers: [
        LoggedInGuard,
        AuthService,
        appStoreProviders
      ],
      declarations: [
        MainComponent,
        LoginComponent,
        AppComponent,
        ChangePasswordComponent
      ]

    });
    fixture = TestBed.createComponent(AppComponent);

    guard = TestBed.get(LoggedInGuard);
    router = TestBed.get(Router)
    location = TestBed.get(Location)
    svc = TestBed.get(AuthService)
    router.initialNavigation();
    fixture.detectChanges();

  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it("should call is_auth api",
      inject(
        [LoggedInGuard, HttpTestingController],
        fakeAsync((guard: LoggedInGuard, backend) => {
          let res;
          guard.canActivate()
          .then(_res => {
              res = _res;
          });
          expectURL(backend, `${environment.apiUrl}/is_auth`, true);
          tick();
          expect(res).toBe(true);
        })
  ));

  it('should navigate to login for a logged out user',

    fakeAsync(() => {
      spyOn(guard, 'canActivate').and.returnValue(Promise.resolve(false));

      router.navigate(['/manager'])
      tick();
      expect(location.path()).toBe('/');
      expect(guard.canActivate).toHaveBeenCalled();
    })
  )
  it('should navigate to manager for a logged in user',

    fakeAsync(() => {

      spyOn(guard, 'canActivate').and.returnValue(Promise.resolve(true));

      router.navigate(['/manager'])
      tick();
      expect(location.path()).toBe('/manager');
      expect(guard.canActivate).toHaveBeenCalled();
    })
  )
  it('should navigate to change_password for a logged in user',

    fakeAsync(() => {
      spyOn(guard, 'canActivate').and.returnValue(Promise.resolve(true));
      router.navigate(['/change_password'])
      tick();
      expect(location.path()).toBe('/change_password');
      expect(guard.canActivate).toHaveBeenCalled();

    })
  )

});
