import { ProgressBarService } from './../../services/progress-bar.service';
import { IUser } from 'src/app/interfaces/user.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as Redux from 'redux';
import { AppState } from '../../app.reducer';
import { AppStore } from '../../app.store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as UserActions from 'src/app/shared/user/user.actions';
import * as InstitutionActions from 'src/app/shared/institution/institution.actions';
import * as YearActions from 'src/app/shared/year/year.actions';
import * as SimiliarInstitutionsActions from 'src/app/shared/similiar-institutions/similiar-institutions.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isProgressOn: boolean;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private progressBarService: ProgressBarService,
    @Inject(AppStore) private store: Redux.Store<AppState>
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {    
    (this.progressBarService.progressBarOn$ as Observable<boolean>).subscribe(value => {
      this.isProgressOn = value;

    })
  }

  submit(): void {
    let data = this.loginForm.value;
    this.authService
      .logInAndUpdateUserInStore(data.email, data.password)
      .subscribe((response: IUser) => {
        if (response.user.is_change_password_required) {
          this.router.navigate(['/change_password']);
        }
        else if (response.user.role.name === "מנהל מרחב") {
          this.router.navigate(['/manager'])
        }
        else if (response.user.role.name === "מנהל מוסד") {
          this.router.navigate(['/institution', response.institution.id, response.institution.last_updated_year])
        }
        else if (!response){
          this.snackBar.open('הכניסה נכשלה. אנא נסה שנית', '', {
            duration: 3000,
          });
        }
        else{
          this.router.navigate(['/manager'])
        }
      },
      err => {
        this.snackBar.open('הכניסה נכשלה. אנא נסה שנית', '', {
            duration: 3000,
          });
          this.progressBarService.off(); 
      });
  }

  forgotPassword(): void {
    this.router.navigate(['/forgot_password']);
  }
}
