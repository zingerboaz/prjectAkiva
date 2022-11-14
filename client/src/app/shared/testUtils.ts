import { 
    HttpTestingController,
  } from "@angular/common/http/testing";
  import {
    
    HttpResponse, HttpErrorResponse,
    
  
  } from "@angular/common/http";
import { By } from '@angular/platform-browser';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs';

export function expectURL(backend: HttpTestingController, url: string, data) {
    const testRequest = backend.expectOne(url); 
    if(typeof data === "boolean"){
        testRequest.event(new HttpResponse<boolean>({body: data}));
    }else{
        testRequest.flush(data);
    }
    return testRequest;
  }

export class FormTestUtils{
  constructor(private component, private fixture){}
  
  required(form, field, msg){
    
      this.component[form].controls[field].setValue('');
      let errors = this.component[form].controls[field].errors || {};
      expect(errors['required']).toBeTruthy();
      this.component[form].controls[field].markAsTouched()
      this.fixture.detectChanges();
      
      const RequiredError = this.fixture.debugElement.query(By.css('mat-error'));
      
      expect(RequiredError).toBeTruthy();
      expect(RequiredError.nativeElement.innerText).toBe(msg);
    
  }

  fillForm(formName: string, params: any): FormGroup {
    this.component[formName].setValue(params);
    return this.component[formName];
  }
}

export class TestAuthService{
  constructor(private svcInstance: AuthService){}

  spyHttpError(funcName: string, value: any, errParams: any): void{
    let observable: BehaviorSubject<any> = new BehaviorSubject(value);
    let err = new HttpErrorResponse(errParams)
    
    observable.error(err)
    spyOn(this.svcInstance, <any>funcName).and.returnValue(observable)
  }

  spyHttpClient(funcName: string, value: any): void{
    let observable: BehaviorSubject<any> = new BehaviorSubject(value);
    spyOn(this.svcInstance, <any>funcName).and.returnValue(observable)
  }
}
  