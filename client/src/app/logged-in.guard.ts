import { AppStore } from './app.store';
import { Inject, Injectable, resolveForwardRef } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './services/auth.service';
import { AppState } from './app.reducer';
import * as Redux from 'redux';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class LoggedInGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar,
        @Inject(AppStore) private store: Redux.Store<AppState>
    ) { }

    canActivate(): Observable<boolean> {
        
        return this.authService.isLoggedIn().pipe(tap(response => {
            console.log('isLoggedIn ', response)
            if (!response){
                this.snackBar.open('אנא בצע כניסה למערכת ולאחר מכן נסה שנית', '', {
                    duration: 3000,
                  });
                  this.router.navigate(['/login']);
            } 
        }))

    }
}
