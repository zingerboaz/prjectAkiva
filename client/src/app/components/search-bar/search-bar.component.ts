import { AuthService } from 'src/app/services/auth.service';
import { ProgressBarService } from './../../services/progress-bar.service';
import { SiteParams } from '../../interfaces/manager-params.type';
import { IYear } from './../../interfaces/year.interface';
import { IInstitution } from './../../interfaces/institution.interface';
import { Component, OnInit, Inject } from '@angular/core';
import {Router, ActivatedRoute, RouterStateSnapshot} from '@angular/router';
import { InstitutionService } from 'src/app/services/institution.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppStore } from 'src/app/app.store';
import { AppState } from 'src/app/app.reducer';
import * as Redux from 'redux';
import {YearsToDisplayService} from "../../services/years-to-display.service";

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
    institutionList: IInstitution[] = [];
    currentInstitutionId: number;
    yearsByInstitution: IYear[] = [];
    currentYearName: string;

    //values from store are used just for display in the select when reloading
    institutionFromStore: IInstitution;
    yearFromStore: IYear;


    constructor(
        private router: Router,
        private institutionService: InstitutionService,
        private snackBar: MatSnackBar,
        private activatedRoute: ActivatedRoute,
        private progressBarService: ProgressBarService,
        @Inject(AppStore) private store: Redux.Store<AppState>,
        private yearsToDisplayService: YearsToDisplayService,
    ) { }

    ngOnInit() {
        this.getInstitutionList();
        this.subscribeToStoreAndRoute();
        this.listenToAvailableYears();
    }

    subscribeToStoreAndRoute() {
        this.store.state.subscribe(state => {
            this.institutionFromStore = state.institution;
            this.yearFromStore = state.year;
        })


        this.activatedRoute.params.subscribe((params: SiteParams) => {
            this.currentInstitutionId = params.institutionId;
            this.currentYearName = params.yearName;
            // if (params.institutionId) this.getYearListByInstitution(this.currentInstitutionId);
        })

    }

    listenToAvailableYears() {
        this.yearsToDisplayService.getAvailableYears()
            .subscribe(availableYears => {
                console.log('Getting Available years', availableYears);
                this.yearsByInstitution = availableYears;
            })
    }

    getInstitutionList(): void {
        this.institutionService.getInstitutionsList().subscribe(
            (data: IInstitution[]) => {
                this.institutionList = data;
            },
            (err) => {
                console.warn(err);
                this.snackBar.open('טעינת רשימת מוסדות נכשלה', '', {
                    duration: 3000,
                });
                this.progressBarService.off();
            }
        );
    }

    onEnterInstitutionName(selectedInstitution: IInstitution) {
        this.activatedRoute.params.subscribe(params => {
            console.log('params', params);
            const currentUrl = this.router.url;
            const currentUrlSegments = currentUrl.split('/');
            const institutionSegmentIndex = currentUrlSegments.findIndex(segment => segment == params.institutionId);
            const pathSegmentIndex = currentUrlSegments.length -1;
            const userTypeSegmentIndex = currentUrlSegments.findIndex(segment => (segment == 'institution' || segment == 'manager'));
            if (institutionSegmentIndex == -1) {
                this.institutionService.updateCurrentYearInStore(null);
                this.router.navigate([currentUrlSegments[userTypeSegmentIndex], 'default_page']).then().catch(console.warn);
            } else {
                console.log('Current institution id from path', currentUrlSegments[institutionSegmentIndex]);
                currentUrlSegments[institutionSegmentIndex] = selectedInstitution.id.toString();
                currentUrlSegments[userTypeSegmentIndex] = this.redirectByAuthorisation(currentUrlSegments[pathSegmentIndex], currentUrlSegments[userTypeSegmentIndex])
                const selectedYearUrl = currentUrlSegments.join('/');
                this.router.navigateByUrl(selectedYearUrl).then().catch(console.warn);
            }

        });

        this.currentInstitutionId = selectedInstitution.id;
        this.getYearListByInstitution(this.currentInstitutionId);
        this.institutionService.updateCurrentInstitutionInStore(selectedInstitution);

    }

    getYearListByInstitution(institutionId: number): void {
        this.institutionService.getYearListByInstitution(institutionId).subscribe(
            (data) => {
                this.yearsByInstitution = data;
                if (!this.yearsByInstitution[0]) {
                    this.snackBar.open('אין שנים להצגה', '', {
                        duration: 3000,
                    });
                }
            },
            (err) => {
                console.warn(err);
                this.snackBar.open('טעינת רשימת שנים נכשלה', '', {
                    duration: 3000,
                });
                this.progressBarService.off();
            }
        );
    }

    onEnterYear(selectedYear: IYear) {
        console.log('%c #OnEnterYear','color:orangered; font-size: 20px;')

        this.activatedRoute.params.subscribe(params => {
            const currentUrl = this.router.url;
            const currentUrlSegments = currentUrl.split('/');
            console.log('%c #CurrentUrl','color:orangered; font-size: 20px;',currentUrl)
            const yearSegmentIndex = currentUrlSegments.findIndex(segment => segment == params.yearName);
            const pathSegmentIndex = currentUrlSegments.length -1;
            const userTypeSegmentIndex = currentUrlSegments.findIndex(segment => (segment == 'institution' || segment == 'manager'));
            if (yearSegmentIndex == -1) {
                this.institutionService.updateCurrentYearInStore(selectedYear);
                let institution = this.store.getState().institution;
                let year = this.store.getState().year;
                if (institution.id && year.name) {
                    this.router.navigate(['manager', institution.id, year.name, 'general-info'])
                        .then().catch(console.warn);
                }
            } else {
                console.log('Current year from path', currentUrlSegments[yearSegmentIndex]);
                currentUrlSegments[yearSegmentIndex] = selectedYear.name;
                currentUrlSegments[userTypeSegmentIndex] = this.redirectByAuthorisation(currentUrlSegments[pathSegmentIndex], currentUrlSegments[userTypeSegmentIndex])
                const selectedYearUrl = currentUrlSegments.join('/');
                this.router.navigateByUrl(selectedYearUrl).then().catch(console.warn);
            }

        });

    }

            //import * as Redux from 'redux';
//currentUser: IUser;
// @Inject(AppStore) private store: Redux.Store<AppState>
// ngOnInit(): void {
//     this.currentUser = this.store.getState().user
//   }
    isEditableInstitution() {
      var currentUser = this.store.getState().user
      var currentInstitution = this.store.getState().institution;
      if (currentInstitution != null && currentUser.institution != null){
        console.log('currentInstitution.id', currentInstitution.id)
        console.log('currentUser.institution.id', currentUser.institution.id)
        return currentInstitution.id == currentUser.institution.id
      }else if (currentUser.institutions_list != null){
         for(var i = 0; i < currentUser.institutions_list.length; i++){
            if(currentInstitution.id == currentUser.institutions_list[i].id){
              return true
            }
         }
         return false
      }else{
        return false
      }
    }

    redirectByAuthorisation(path, userType){
       console.log('path', path)
       if(this.store.getState().user == null || this.store.getState().user.user == null || this.store.getState().user.user.role == null
        || this.store.getState().user.user.role.name == 'מפתח'){
          return userType
       }
       userType = this.store.getState().user.user.role.name === 'מנהל מוסד' ? 'institution': 'manager'
       console.log('userType', userType)
       var isEditable = this.isEditableInstitution()
       console.log('isEditable', isEditable)
       switch(path){
        case 'year-goals':
          console.log(userType)
          console.log(isEditable)
          if(userType === 'manager' || (userType === 'institution' && !isEditable)){
            return 'manager'
          }else{
            return 'institution'
          }
          break;
        case 'staff':
          if(userType === 'institution' || (userType === 'manager' && !isEditable)){
            return 'institution'
          }else{
            return 'manager'
          }
          break;
        case 'participation':
          if(userType === 'institution' || (userType === 'manager' && !isEditable)){
            return 'institution'
          }else{
            return 'manager'
          }
          break;
        case 'academics':
          if(userType === 'institution' || (userType === 'manager' && !isEditable)){
            return 'institution'
          }else{
            return 'manager'
          }
          break;
        case 'educational-data':
          if(userType === 'institution' || (userType === 'manager' && !isEditable)){
            return 'institution'
          }else{
            return 'manager'
          }
          break;
        case 'general-info':
          console.log('general-info')
          if(userType === 'manager' || (userType === 'institution' && !isEditable)){
            return 'manager'
          }else{
            return 'institution'
          }
          break;
        case 'conclusions':
          if(userType === 'manager' || (userType === 'institution' && !isEditable)){
            return 'manager'
          }else{
            return 'institution'
          }
          break;
        default :
           return userType
        }
    }



}
