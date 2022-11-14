import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ProgressBarService } from 'src/app/services/progress-bar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  loginForm: FormGroup;
  isProgressOn: boolean;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authSvc: AuthService,
    private route: Router,
    private progressBarService: ProgressBarService,
  ) {
    this.loginForm = fb.group({
      email: ['', Validators.required],
    });
  }

  ngOnInit() {
    (this.progressBarService.progressBarOn$ as Observable<boolean>).subscribe(value => {
      this.isProgressOn = value;
    })
  }

  submit(): void {
    let data = this.loginForm.value;
    this.authSvc.forgotPassword(data.email).subscribe(
      (res) => {
        this.snackBar.open(
          'סיסמא זמנית נשלחה אל תיבת הדואר האלקטרוני שלך. הינך מועבר אל דף הכניסה למערכת',
          '',
          {
            duration: 3000,
          }
        );
        setTimeout(() => {
          this.route.navigate(['login']);
        }, 3000);
      },
      (err) => {
        this.snackBar.open(err.statusText, '', {
          duration: 3000,
        });
        this.progressBarService.off();
      }
    );
  }
}
