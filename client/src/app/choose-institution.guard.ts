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
export class ChooseInstitutionGuard implements CanActivate {
  constructor(@Inject(AppStore) private store: Redux.Store<AppState>,
   private router: Router) {}
  canActivate(): Promise<boolean> {
    return new Promise((res) => {
      if(!this.store.getState().institution || !this.store.getState().year){
        if(this.store.getState().user.user.role.name == 'מנהל מוסד'){
          this.router.navigate(['institution','default_page'])
        }else{
          this.router.navigate(['manager','default_page'])
        }
        res(false)
      }else{
        res(true)
      }
    })
  }
}
