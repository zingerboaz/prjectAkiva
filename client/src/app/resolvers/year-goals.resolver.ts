import { IYearGoal, IYearGoals } from './../interfaces/yearGoal.interface';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs';
import { InstitutionService } from '../services/institution.service';
import { map } from 'rxjs/operators';
@Injectable(
    { providedIn: 'root' }
)
export class YearGoalsResolver implements Resolve<any>{

    constructor(private institutionService: InstitutionService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IYearGoals> {
        return this.institutionService.getYearGoals(route.parent.params.institutionId, route.parent.params.yearName).pipe(
            map((yearGoals: IYearGoals) => {
                yearGoals.excellence.scopeName = "מצוינות";
                yearGoals.identity.scopeName = "זהות";
                yearGoals.mission.scopeName = "שליחות";
                return yearGoals
            })
        )
    }

}
