import { state } from '@angular/animations';
import { AppStore } from './app.store';
import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AppState } from './app.reducer';
import * as Redux from 'redux';


@Injectable({
  providedIn: 'root',
})
export class DefaultPageGuard implements CanActivate {
  constructor(@Inject(AppStore) private store: Redux.Store<AppState>,
   private router: Router,
    private activatedRoute: ActivatedRoute) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((res, rej) => {
      if(this.store.getState().institution && this.store.getState().year){
        this.router.navigate(['manager',this.store.getState().institution.id,  this.store.getState().year.name, 'general-info'])
        res(false)
      }else{
        res(true)
      }
    })
  }
}
