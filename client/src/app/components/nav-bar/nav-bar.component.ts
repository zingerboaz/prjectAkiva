import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppStore } from 'src/app/app.store';
import { AppState } from 'src/app/app.reducer';
import * as Redux from 'redux';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Output,
  EventEmitter,
  Input,
  Inject,
} from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  mode: 'manager' | 'institution';
  tabList: { name: string; path: string }[];

  constructor(private activatedRoute: ActivatedRoute,
    @Inject(AppStore) private store: Redux.Store<AppState>) { }

  ngOnInit(): void {
    this.initTabs();
  }

  initTabs() {
    this.activatedRoute.url.subscribe(url => {
      console.log('update nav')
      this.mode = <'institution' | 'manager'>(url[0].path)
      var isMyInstitution = this.isMyInstitution();
      this.initTabList(isMyInstitution)
    });
  }

  initTabList(includeConculsion) {
    this.tabList =
      includeConculsion
        ? [
          { icon: '../../../assets/icons/maskanot-1.png', name: 'נקודות לשימור ולשיפור', path: 'conclusions' },
          { icon: '../../../assets/icons/yeadim-lechana-zo.png', name: 'תוכנית עבודה', path: 'year-goals' },
          { icon: '../../../assets/icons/madadey-tsevet-hamoussad.png', name: 'מדדי צוות המוסד', path: 'staff' },
          { icon: '../../../assets/icons/madadey-hichtatafout.png', name: 'מדדי השתתפות', path: 'participation' },
          { icon: '../../../assets/icons/madadim-limoudiym.png', name: 'מדדים לימודיים', path: 'academics' },
          { icon: '../../../assets/icons/netounim-hiounym.png', name: 'נתונים חינוכיים', path: 'educational-data' },
          { icon: '../../../assets/icons/netounim-clalim.png', name: 'חזון המוסד', path: 'general-info' },
        ].reverse()
        : [
          { icon: '../../../assets/icons/yeadim-lechana-zo.png', name: 'תוכנית עבודה', path: 'year-goals' },
          { icon: '../../../assets/icons/madadey-tsevet-hamoussad.png', name: 'מדדי צוות המוסד', path: 'staff' },
          { icon: '../../../assets/icons/madadey-hichtatafout.png', name: 'מדדי השתתפות', path: 'participation' },
          { icon: '../../../assets/icons/madadim-limoudiym.png', name: 'מדדים לימודיים', path: 'academics' },
          { icon: '../../../assets/icons/netounim-hiounym.png', name: 'נתונים חינוכיים', path: 'educational-data' },
          { icon: '../../../assets/icons/netounim-clalim.png', name: 'חזון המוסד', path: 'general-info' },
        ].reverse();
  }

  
  isMyInstitution() {
    var currentUser = this.store.getState().user
    var currentInstitution = this.store.getState().institution;
    if (currentInstitution != null && currentUser.institution != null) {
      console.log('currentInstitution.id', currentInstitution.id)
      console.log('currentUser.institution.id', currentUser.institution.id)
      return currentInstitution.id == currentUser.institution.id
    } else {
      return false
    }
    return false
  }
}
