import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
import { LoginComponent } from './login.component';
import { FormGroup, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService} from '../../services/auth.service'
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, observable, Subject, BehaviorSubject } from 'rxjs';
import { routes } from '../../app-routing.module'
import { Router } from '@angular/router';
import * as Redux from 'redux';
import {
  AppState,
} from '../../app.reducer';
import {
  appStoreProviders,
  AppStore
} from '../../app.store';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';
import {Location} from "@angular/common";
import { FormTestUtils, TestAuthService } from 'src/app/shared/testUtils';

interface LoginResponse {
  user: {
    id: number;
    name: string;
    is_change_password_required: boolean;
  }
}

function generateLoginResponse(is_change_password_required): LoginResponse {
  return {
    user: {
      id: 1,
      name: 'Chaim Vaidberg',
      is_change_password_required
    }
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSvc: AuthService;
  let store: Redux.Store<AppState>;
  let router: Router;
  let snackBar: MatSnackBar;
  let location: Location;
  let formParams: {email: string, password: string}

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports:[
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        AuthService,
        appStoreProviders,
      ],
      declarations: [ LoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.get(AppStore)
    authSvc = TestBed.get(AuthService)
    router = TestBed.get(Router)
    snackBar = TestBed.get(MatSnackBar)
    location = TestBed.get(Location)
    formParams = {
      email: 'chiam@gmail.com',
      password: 'password'
    }
    router.initialNavigation();
    fixture.detectChanges();
  }));



  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should has loginForm object', () => {
    expect(component.loginForm instanceof FormGroup).toBe(true)
    expect(component.loginForm.value).toEqual({email: '', password: ''})
    expect(component.loginForm.valid).toBe(false)
  })
  it('should contain form element', () => {
    const form = fixture.nativeElement.querySelector('form');
    expect(form).toBeTruthy();
  });
  it('should contain two inputs', () => {
    const inputs = fixture.debugElement.queryAll(By.css('mat-form-field input'));
    expect(inputs.length).toBe(2);
  });

  it('should contain Email and Password Label', () => {
    const labels = fixture.debugElement.queryAll(By.css('mat-label'));

    expect(labels.length).toBeTruthy(2);
    expect(labels[0].nativeElement.innerText).toBe('Email');
    expect(labels[1].nativeElement.innerText).toBe('Password');
  });

  it('should not contain Required error msg if form has not interacted', () => {
    const EmailRequiredError = fixture.debugElement.query(By.css('mat-error'));
    expect(EmailRequiredError).not.toBeTruthy();

  });

  it('should contain Required error msg if email doesn\'t exist',() => {
      new FormTestUtils(component, fixture).required(
        'loginForm', 'email', 'Email is required'
      )
  });
  it('should  contain Email Format error msg if email exist', () => {
    component.loginForm.controls.email.setValue('incorrectMail')
    let errors = component.loginForm.controls.email.errors || {};
    expect(errors['email']).toBeTruthy();
    component.loginForm.controls.email.markAsTouched()
    fixture.detectChanges();
    const EmailRequiredError = fixture.debugElement.query(By.css('mat-error'));
    expect(EmailRequiredError).toBeTruthy();
    expect(EmailRequiredError.nativeElement.innerText).toBe('Please enter a valid email address');
  });
  it('should contain Required error msg if password doesn\'t exist',() => {
      new FormTestUtils(component, fixture).required(
        'loginForm', 'password', 'Password is required'
      )
  });
  describe('submit btn', ()=>{

    it('should contain submit btn', ()=>{
      let btn = fixture.debugElement.query(By.css('button'))
      expect(btn).toBeTruthy()
      expect(btn.nativeElement.innerText).toBe('Submit')
    })
    it('should be disabled until form is valid', () => {
      let btn = fixture.debugElement.query(By.css('button'))
      expect(btn).toBeTruthy();
      expect(btn.attributes.disabled).toBeTruthy();
      new FormTestUtils(component, fixture)
        .fillForm('loginForm', formParams)
        .markAsTouched();
      fixture.detectChanges();
      expect(btn.attributes.disabled).toBeFalsy()

    })
    it('should call submit function', ()=>{
      spyOn(component, 'submit');
      let btn = fixture.debugElement.query(By.css('button'));
      expect(btn).toBeTruthy();
      // enable submit btn
      new FormTestUtils(component, fixture)
        .fillForm('loginForm', formParams)
        .markAsTouched();
      fixture.detectChanges()
      btn.nativeElement.click()
      fixture.detectChanges()
      expect(component.submit).toHaveBeenCalled()

    })
  })
  describe('submit function', ()=>{
    it('should call AuthService.logIn', ()=>{
      spyOn(authSvc, 'logIn').and.returnValue(new Observable)
      component.submit();
      expect(authSvc.logInAndUpdateUserInStore).toHaveBeenCalled();
    })
    it('should call AuthService.logIn with loginForm email and password', ()=>{
      new FormTestUtils(component, fixture)
        .fillForm('loginForm', formParams);
      spyOn(authSvc, 'logIn').and.returnValue(new Observable)
      component.submit();
      expect(authSvc.logInAndUpdateUserInStore).toHaveBeenCalledWith(formParams.email, formParams.password);
    })
    it('should display error msg if login is failed', fakeAsync(()=>{
      spyOn(snackBar, 'open');
      new TestAuthService(authSvc)
        .spyHttpError('logIn',
         generateLoginResponse(false),
          {statusText: "test error"})
      component.submit();
      tick()

      expect(snackBar.open).toHaveBeenCalledWith('test error', '', {
        duration: 2000,
      });
    }))
    it('should navigate to home if change password is not required', fakeAsync(()=>{
      spyOn(router, 'navigate');
      new TestAuthService(authSvc)
        .spyHttpClient('logIn', generateLoginResponse(false))
      component.submit();
      tick()
      expect(store.getState().user).toEqual({
        id: 1,
        name: 'Chaim Vaidberg',
        is_change_password_required: false
      })
      expect(router.navigate).toHaveBeenCalledWith(['/manager']);
    }))
    it('should navigate to ChangePassword component if change pass is required', fakeAsync(()=>{
      new TestAuthService(authSvc)
        .spyHttpClient('logIn', generateLoginResponse(true))
      spyOn(authSvc, 'isLoggedIn').and.returnValue(Promise.resolve(true))
      component.submit();
      tick()
      expect(store.getState().user).toEqual({
        id: 1,
        name: 'Chaim Vaidberg',
        is_change_password_required: true
      })
      expect(location.path()).toBe('/change_password')
    }))



  })
  describe('userState',()=>{
    it('should contain user details after login', fakeAsync(()=>{

      new TestAuthService(authSvc)
        .spyHttpClient('logIn', generateLoginResponse(true))
      component.submit();
      tick()
      expect(store.getState().user).toEqual({
        id: 1,
        name: 'Chaim Vaidberg',
        is_change_password_required: true
      })

    }))
  })
});
