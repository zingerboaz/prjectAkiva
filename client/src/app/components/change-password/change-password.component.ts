import { ProgressBarService } from 'src/app/services/progress-bar.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as UserActions from 'src/app/shared/user/user.actions';
import * as Redux from 'redux';
import { AppState } from '../../app.reducer';
import { AppStore } from '../../app.store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePassForm: FormGroup;
  isProgressOn: boolean;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private progressBarService: ProgressBarService,
    @Inject(AppStore) private store: Redux.Store<AppState>
  ) {
    this.changePassForm = this.fb.group(
      {
        old_password: ['', [Validators.required]],
        new_password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
      },
      { validator: this.checkPasswords }
    );
  }

  ngOnInit(): void {
    (this.progressBarService.progressBarOn$ as Observable<boolean>).subscribe(value => {
      this.isProgressOn = value;
    })
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('new_password').value;
    let confirmPass = group.get('confirm_password').value;

    return pass === confirmPass ? null : { notSame: true };
  }

  submit(): void {
    let data = this.changePassForm.value;
    this.authService
      .changePassword(data.old_password, data.new_password)
      .subscribe(
        () => {
          this.store.dispatch(UserActions.setUser(null));
          this.snackBar.open('סיסמתך שונתה בהצלחה! הינך מועבר אל דף הכניסה על מנת לבצע כניסה מחדש אל המערכת', '', {
            duration: 2000,
          });
          setTimeout(() => {
            this.route.navigate(['login']);
          }, 3000);
        },
        (err) => {
          this.snackBar.open(err.statusText, '', {
            duration: 2000,
          });
          this.progressBarService.off(); 
        }
      );
  }
}
