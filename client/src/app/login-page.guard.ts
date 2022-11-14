import { Location } from '@angular/common';
import { AppState } from './app.reducer';
import { Inject, Injectable, resolveForwardRef } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppStore } from './app.store';
import { AuthService } from './services/auth.service';
import * as Redux from 'redux';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
    providedIn: 'root',
})
export class LoginPageGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router,
        private location: Location,
        private snackBar: MatSnackBar,
        @Inject(AppStore) private store: Redux.Store<AppState>
    ) { }

    canActivate(route, snap): Observable<boolean> { 
        console.log(route, snap)       
        return this.authService.isLoggedIn().pipe(
            map(response => {
                console.log('isLoggedIn ', response);
                if(response){
                    this.snackBar.open('אנא בצע יציאה מהמערכת ולאחר מכן נסה שנית', '', {
                    duration: 3000,
                  });
                  // this.location.back();
                }               

                return !response
            }))
    }
}
