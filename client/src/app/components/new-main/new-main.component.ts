import { Component, OnInit, Inject } from '@angular/core';
import { AppState } from 'src/app/app.reducer';
import { AppStore } from 'src/app/app.store';
import { ProgressBarService } from 'src/app/services/progress-bar.service';
import * as Redux from 'redux';

@Component({
  selector: 'app-new-main',
  templateUrl: './new-main.component.html',
  styleUrls: ['./new-main.component.scss']
})
export class NewMainComponent implements OnInit {

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
