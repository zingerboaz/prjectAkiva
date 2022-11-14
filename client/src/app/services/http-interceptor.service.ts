import { ProgressBarService } from './progress-bar.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {


  constructor(private cookieService: CookieService,
     private progressBarService: ProgressBarService,
     private snackBar: MatSnackBar,) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.progressBarService.on()

    let csrf = this.cookieService.get('csrftoken')
      ? this.cookieService.get('csrftoken')
      : '';
    request = request.clone({
      headers: new HttpHeaders({
        'X-CSRFToken': csrf,
      }),
    });

    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.progressBarService.off()
        }
        // else if (event instanceof HttpErrorResponse) {
        //   this.progressBarService.off();
        //   this.snackBar.open('התרחשה שגיאה. אנא נסה שנית', '', {
        //     duration: 4000,
        //   });
        // }
      }))

  }
}
