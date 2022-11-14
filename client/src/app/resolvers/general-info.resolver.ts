import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs';
import { IInstitutionGeneralData } from '../interfaces/institution-general-data.interface';
import { InstitutionService } from '../services/institution.service';
@Injectable(
  { providedIn: 'root' }
)
export class GeneralInfoResolver implements Resolve<any>{

  constructor(private institutionService: InstitutionService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IInstitutionGeneralData> {
    return this.institutionService
      .getInstitutionGeneralDataByYear(route.parent.params.institutionId, route.parent.params.yearName)
  }

}
