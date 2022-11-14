import { ProgressBarService } from './../../services/progress-bar.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpInterceptorService } from './../../services/http-interceptor.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IUser } from 'src/app/interfaces/user.interface';
import { ThrowStmt } from '@angular/compiler';

@Component({
    selector: 'app-institution-main',
    templateUrl: './institution-main.component.html',
    styleUrls: ['./institution-main.component.scss']
})
export class InstitutionMainComponent implements OnInit {
    isProgressOn: boolean;

    constructor(
        private httpInterceptorService: HttpInterceptorService,
        private progressBarService: ProgressBarService) { }

    ngOnInit() {
        this.progressBarService.progressBarOn$.subscribe(value => {
            setTimeout(() => {
                this.isProgressOn = value;
            })


        })

    }

}
