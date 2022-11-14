import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { AppState } from 'src/app/app.reducer';
import { AppStore } from './../../app.store';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import * as Redux from 'redux';
import { concatMap } from 'rxjs/operators';
import { ProgressBarService } from 'src/app/services/progress-bar.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  isProgressOn:boolean
  showNavBar: boolean;

  constructor(
    @Inject(AppStore) private store: Redux.Store<AppState>,
    private progressBarService: ProgressBarService,
         ) {}

  ngOnInit(): void {
    this.store.state.subscribe((state) => {
      this.showNavBar =
        !!state.year && !!state.institution;
    });


    this.progressBarService.progressBarOn$.subscribe(value => {
        setTimeout(() => {
            this.isProgressOn = value
        })

    })

  }
}
