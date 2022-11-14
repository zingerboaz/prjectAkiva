import{ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree}from "@angular/router";
import {Observable, of}from "rxjs";
import {InstitutionService}from "../services/institution.service";
import {Inject, Injectable}from "@angular/core";
import {DATA_TYPE_ROUTES, DataTypesEnum}from "../services/data-types.enum";
import {concatMap, map, tap}from "rxjs/operators";
import {AppStore} from "../app.store";
import * as Redux from "redux";
import {AppState}from "../app.reducer";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SET_YEAR}from "../shared/year/year.actions";
import {YearsToDisplayService}from "../services/years-to-display.service";
import * as YearActions from "../shared/year/year.actions";

@Injectable({ providedIn: "root"})
export class DataAvailableYearsGuard implements CanActivate {
constructor(
        private institutionDataService: InstitutionService,
        private router: Router,
        @Inject(AppStore) private store: Redux.Store<AppState>,
        private snackBar: MatSnackBar,
        private yearsToDisplayService: YearsToDisplayService
        ) {}

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
//          if(userType === 'manager' || (userType === 'institution' && !isEditable)){
//            return 'manager'
//          }else{
            return 'institution'
//          }
          break;
        default :
           return userType
        }
    }

    canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree>  {
        console.log('Can Activate');
        let urlSegments = state.url.split('/').reverse();
        const yearFromUrl = urlSegments[1];
        const institutionFromUrl = urlSegments[2]
        const dataTypeRouteFromUrl = urlSegments[0]
        urlSegments[3] = this.redirectByAuthorisation(urlSegments[0], urlSegments[3])
        console.log('url segments', urlSegments);
        console.log('yearFromUrl', yearFromUrl)
        let dataType = '';
        DATA_TYPE_ROUTES.forEach((value, key) => {
            console.log(`value = ${value}, key = ${key}`)
            if (value == dataTypeRouteFromUrl) {
                dataType = key;
            }
        })
        console.log('Data Type', dataType);

          return this.institutionDataService
              .getIndicesTypeAvailableYears(+institutionFromUrl, DataTypesEnum[dataType])
              .pipe(
                  map((response: any) => {
                      console.log("response of indices type available years", response);
                      const availableYears: Array <any> = response.available_years;
                      if (!availableYears.length) {return true;}
                      const formattedAvailableYears = availableYears.map(year => {
                          const { hebrew_name, name } = year;
                          year.fullName = `${hebrew_name} ${name}`
                          return year;
                      });

                      this.yearsToDisplayService.setAvailableYears(formattedAvailableYears);
                      for (let yearObj of availableYears) {
                          if (yearObj.name == yearFromUrl){
                              // this.institutionDataService.updateCurrentYearInStore(formattedAvailableYears[0]);
                              return true;
                          }
                      }
                      urlSegments[1] = formattedAvailableYears[0].name;

                      const availableYearUrl =  urlSegments.reverse().join('/');
                      this.snackBar.open(`.אין מידע על השנה שבחרת! אתה מועבר לשנה ${availableYears[0].name}`,'', {duration: 3000});
                      this.institutionDataService.updateCurrentYearInStore(formattedAvailableYears[0]);
                      this.router.navigateByUrl(availableYearUrl).then().catch()
                      return false;
                  })
              );

    }


}
