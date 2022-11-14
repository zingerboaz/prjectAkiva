import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangePasswordComponent } from './change-password.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FormTestUtils, TestAuthService } from 'src/app/shared/testUtils';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import * as Redux from 'redux';
import {
  AppState,
} from '../../app.reducer';
import {
  appStoreProviders,
  AppStore
} from '../../app.store';
import * as UserActions from  'src/app/shared/user/user.actions'

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let authSvc: AuthService;
  let router: Router;
  let store: Redux.Store<AppState>;
  let formParams: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }
  let snackBar: MatSnackBar
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSnackBarModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        AuthService,
        appStoreProviders,
      ],
      declarations: [ ChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    authSvc = TestBed.get(AuthService)
    snackBar = TestBed.get(MatSnackBar)
    router = TestBed.get(Router)
    store = TestBed.get(AppStore)
    formParams = {
      old_password:     'old_password',
      new_password:     'new_password',
      confirm_password: 'new_password',
    }
    store.dispatch(UserActions.setUser({
      id: 1,
      name: 'Chaim Vaidberg',
      is_change_password_required: true
    }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should has changePassForm', () => {
    expect(component.changePassForm instanceof FormGroup).toBe(true)
    expect(component.changePassForm.value).toEqual({
      old_password: '',
      new_password: '',
      confirm_password: ''
    })
    expect(component.changePassForm.valid).toBe(false)
  })

  describe('changePassForm', ()=>{
    it('pass and confirm should be identical', ()=>{
      component.changePassForm.setValue(
        {
          old_password: 'Chaim',
          new_password: 'Chaim1',
          confirm_password: 'Chaim2'

        })
      fixture.detectChanges();
      expect(component.changePassForm.valid).toBe(false)

      component.changePassForm.setValue(
        {
          old_password: 'Chaim',
          new_password: 'Chaim1',
          confirm_password: 'Chaim1'

        })
      fixture.detectChanges();
      expect(component.changePassForm.valid).toBe(true)

    })
  })
  it('should contain form element', () => {
    const form = fixture.debugElement.query(By.css('form'));
    expect(form).toBeTruthy();
  });

  it('should contain three inputs', () => {
    const inputs = fixture.debugElement.queryAll(By.css('mat-form-field input'));
    expect(inputs.length).toBe(3);
  });

  it('should contain appropriates Labels', () => {
    const labels = fixture.debugElement.queryAll(By.css('mat-label'));

    expect(labels.length).toBeTruthy(2);
    expect(labels[0].nativeElement.innerText).toBe('Old Password');
    expect(labels[1].nativeElement.innerText).toBe('New Password');
    expect(labels[2].nativeElement.innerText).toBe('Confirm Password');
  });

  it('should not contain Required error msg if form has not interacted', () => {
    const EmailRequiredError = fixture.debugElement.query(By.css('mat-error'));
    expect(EmailRequiredError).not.toBeTruthy();

  });

  it('should contain Required error msg if old password doesn\'t exist',() => {
      new FormTestUtils(component, fixture).required(
        'changePassForm', 'old_password', 'Old password is required'
      )
  });

  it('should contain Required error msg if new password doesn\'t exist',() => {
    new FormTestUtils(component, fixture).required(
      'changePassForm', 'new_password', 'New password is required'
    )
});

it('should contain Required error msg if confirm password doesn\'t exist',() => {
  new FormTestUtils(component, fixture).required(
    'changePassForm', 'confirm_password', 'Confirm password is required'
  )
});

describe('submit btn', ()=>{
  it('should contain submit btn', ()=>{
    let btn = fixture.debugElement.query(By.css('button'))
    expect(btn).toBeTruthy()
    expect(btn.nativeElement.innerText).toBe('Submit')
  })
  it('should be disabled until form is valid', () => {
    let btn = fixture.debugElement.query(By.css('button'));
    expect(btn).toBeTruthy();
    expect(btn.attributes.disabled).toBeTruthy();
    new FormTestUtils(component, fixture)
      .fillForm('changePassForm', formParams)
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
      .fillForm('changePassForm', formParams)
      .markAsTouched();
    fixture.detectChanges();
    btn.nativeElement.click();
    fixture.detectChanges();
    expect(component.submit).toHaveBeenCalled()
  })
})
describe('submit function', ()=>{
  it('should call AuthService.changPassword', ()=>{

    spyOn(authSvc, 'changePassword').and.returnValue(new Observable)
    component.submit();
    expect(authSvc.changePassword).toHaveBeenCalled();
  })
  it('should call AuthService.changePassword with changePassForm old_password and new_password', ()=>{
    store.dispatch(UserActions.setUser({
      id: 1,
      name: 'Chaim Vaidberg',
      is_change_password_required: true
    }))
    new FormTestUtils(component, fixture)
      .fillForm('changePassForm', formParams);
    spyOn(authSvc, 'changePassword').and.returnValue(new Observable)
    fixture.detectChanges()
    component.submit();
    expect(authSvc.changePassword).toHaveBeenCalledWith(store.getState().user.id, formParams.old_password, formParams.new_password);
  })
  it('should display error msg if login is failed', fakeAsync(()=>{
    spyOn(snackBar, 'open');
    new TestAuthService(authSvc)
      .spyHttpError('changePassword',
        true,
        {statusText: "test error"})
    component.submit();
    tick()

    expect(snackBar.open).toHaveBeenCalledWith('test error', '', {
      duration: 2000,
    });
  }))
  it('should change is_change_password_required to false if password has been changed successfully', fakeAsync(()=>{

    spyOn(router, 'navigate');
    new TestAuthService(authSvc)
      .spyHttpClient('changePassword',
        true)
    component.submit();
    tick()
    expect(store.getState().user).toEqual({
      id: 1,
      name: 'Chaim Vaidberg',
      is_change_password_required: false
    })
  }))
  it('should navigate to home if password has been changed successfully', fakeAsync(()=>{
    spyOn(router, 'navigate');
    new TestAuthService(authSvc)
      .spyHttpClient('changePassword',
        true)
    component.submit();
    tick()
    expect(router.navigate).toHaveBeenCalledWith(['/manager']);
  }))
})

});
