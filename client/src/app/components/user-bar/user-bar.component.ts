import { InstitutionService } from 'src/app/services/institution.service';
import { ProgressBarService } from './../../services/progress-bar.service';
import { IUser } from '../../interfaces/user.interface';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppStore } from 'src/app/app.store';
import * as Redux from 'redux';
import { AppState } from 'src/app/app.reducer';
import * as UserActions from 'src/app/shared/user/user.actions';
import * as InstitutionActions from 'src/app/shared/institution/institution.actions';
import * as YearActions from 'src/app/shared/year/year.actions';
import * as SimiliarInstitutionsActions from 'src/app/shared/similiar-institutions/similiar-institutions.actions';


@Component({
  selector: 'app-user-bar',
  templateUrl: './user-bar.component.html',
  styleUrls: ['./user-bar.component.scss'],
})
export class UserBarComponent implements OnInit {
  currentUser: IUser;

  constructor(
    private authService: AuthService,
    private router: Router,
    private progressBarService: ProgressBarService,
    private snackBar: MatSnackBar,
    @Inject(AppStore) private store: Redux.Store<AppState>

  ) { }

  ngOnInit(): void {
    this.currentUser = this.store.getState().user
  }

  logout(): void {
    this.authService.logOut().subscribe((response) => {
      if (response) {
        this.store.dispatch(UserActions.setUser(null));
        this.store.dispatch(InstitutionActions.setInstitution(null));
        this.store.dispatch(YearActions.setYear(null));
        this.store.dispatch(SimiliarInstitutionsActions.setSimiliarInnstitutions(null))
        this.router.navigate(['/login'])
      } else {
        this.snackBar.open('היציאה נכשלה. אנא נסה שנית', '', {
          duration: 3000,
        });
        this.progressBarService.off();
      }
    });
  }
}
