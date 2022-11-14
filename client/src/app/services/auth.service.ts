import { saveState } from './../shared/localStorage';
import { AppStore } from './../app.store';
import { IUser } from './../interfaces/user.interface';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, pipe } from 'rxjs';
import {
    HttpBackend,
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie';
import { catchError, map, tap } from 'rxjs/operators';
import * as Redux from 'redux';
import { AppState } from '../app.reducer';
import * as UserActions from 'src/app/shared/user/user.actions';
import * as InstitutionActions from 'src/app/shared/institution/institution.actions';
import * as YearActions from 'src/app/shared/year/year.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class AuthService {


    constructor(
        private http: HttpClient,
        @Inject(AppStore) private store: Redux.Store<AppState>,
    ) { }



    logInAndUpdateUserInStore(email: string, password: string): Observable<IUser> {
        return this.http
            .post<IUser>(`${environment.apiUrl}/login`, {
                email,
                password,
            })
            .pipe(
                map((user: IUser) => {
                    if (user) {
                        this.store.dispatch(UserActions.setUser(user));
                    }
                    return user ? user : null;
                })
            );
    }

    isLoggedIn(): Observable<boolean> {
        return this.http.get(environment.apiUrl + '/is_auth').pipe(
            map((response: any) => response.loggedIn))
    }

    changePassword(oldPassword: string, newPassword: string): Observable<any> {
        return this.http.post<any>(
            `${environment.apiUrl}/change_password`,
            { old_password: oldPassword, new_password: newPassword },

        ).pipe()
    }

    logOut(): Observable<boolean> {
        return this.http.get<any>(`${environment.apiUrl}/logout`).pipe(
            catchError((err: HttpErrorResponse) => {
                console.warn(err);
                return of(false);
            }),
            map((response) => {
                console.log(response);
                return response.loggedOut;
            })
        );
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/forgot_password`, {
            email,
        }).pipe(tap(console.log))
    }
}

export const AUTH_PROVIDERS: Array<any> = [
    { provide: AuthService, useClass: AuthService },
];
