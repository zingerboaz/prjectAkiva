import {IEducationalData} from './../interfaces/educational-data.interface';
import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router'
import {Observable} from 'rxjs';
import {InstitutionService} from '../services/institution.service';
import {AppStore} from '../app.store';
import {AppState} from '../app.reducer';
import * as Redux from 'redux';


@Injectable(
    {providedIn: 'root'}
)
export class EducationalDataResolver implements Resolve<any> {
    
    constructor (
        private institutionService: InstitutionService,
        @Inject(AppStore) private store: Redux.Store<AppState>
    ) {}
    
    resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEducationalData[]> {
        let similarInstitutionsIds: number[];
        let {similarInstitutions} = this.store.getState();
        if (similarInstitutions) {
            similarInstitutionsIds = similarInstitutions.map(institution => institution.id)
        }
        
        return this.institutionService.getEducationalData(
            route.parent.params.institutionId,
            route.parent.params.yearName,
            similarInstitutionsIds
        )
        
    }
}
