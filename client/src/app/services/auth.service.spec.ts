import { inject, fakeAsync, tick, TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {
  HttpTestingController,
  HttpClientTestingModule
} from "@angular/common/http/testing";

import { environment } from '../../environments/environment'
import { expectURL } from '../shared/testUtils'
import { HttpClient } from '@angular/common/http';


describe('AuthService', () => {
  let service: AuthService;
  let client: HttpClient;
  let userId = 1;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
      ]
    });
    service = TestBed.inject(AuthService);
    client = TestBed.get(HttpClient)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('isLoggedIn', () => {
    it("isLoggedIn should return user auth status",
      inject(
        [AuthService, HttpTestingController],
        fakeAsync((svc: AuthService, backend) => {
          let res;

          svc.isLoggedIn().then(_res => {
              res = _res;
          });
          expectURL(backend, `${environment.apiUrl}/is_auth`, true);
          tick();
          expect(res).toBe(true);
        })
    ));
  })

  describe('logIn', () => {
    let loginUrl = `${environment.apiUrl}/login`
    it("should be called with backend login url",
      inject(
        [AuthService, HttpTestingController],
        fakeAsync((svc: AuthService, backend) => {
          let res;
          svc.logInAndUpdateUserInStore('chaim@gmail.com', 'password').subscribe(_res => {
              res = _res;
          });
          expectURL(backend, loginUrl , true);
          tick();
        })
    ));
    it("should call clientHttp.post with url and data {email, password}",
      inject(
        [AuthService, HttpTestingController],
        fakeAsync((svc: AuthService, backend) => {
          spyOn(client, 'post')
          svc.logInAndUpdateUserInStore('chaim@gmail.com', 'password')
          expect(client.post).toHaveBeenCalledWith(loginUrl, {email:'chaim@gmail.com', password: 'password'})
          tick();

        })
    ));
  })
  describe('changePassword', () => {
    let changePasswordUrl = `${environment.apiUrl}/change_password/${userId}`
    it("should be called with backend changePass url",
      inject(
        [AuthService, HttpTestingController],
        fakeAsync((svc: AuthService, backend) => {

          let res;

          svc.changePassword(userId, 'password', 'password').subscribe(_res => {
              res = _res;
          });
          expectURL(backend, changePasswordUrl , true);
          tick();
        })
    ));
    it("should call clientHttp.post with url and data {old_password, new_password}",
      inject(
        [AuthService, HttpTestingController],
        fakeAsync((svc: AuthService, backend) => {
          spyOn(client, 'post')

          svc.changePassword(userId, 'password', 'password')
          expect(client.post).toHaveBeenCalledWith(changePasswordUrl , {old_password:'password', new_password: 'password'},{ withCredentials: true })
          tick();
        })
    ));
  })
});

