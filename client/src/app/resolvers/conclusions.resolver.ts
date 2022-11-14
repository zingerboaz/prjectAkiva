import { IConclusion } from '../interfaces/conclusion.interface';
import { IAcademicsData } from './../interfaces/academics.interface';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { forkJoin, Observable } from 'rxjs';
import { InstitutionService } from '../services/institution.service';

@Injectable(
  { providedIn: 'root' }
)
export class ConclusionsResolver implements Resolve<any>{

  constructor(private institutionService: InstitutionService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IConclusion[]> {
    return forkJoin([
        this.institutionService.getConclusion(route.parent.params.institutionId, route.parent.params.yearName, 'SOCIAL'),
        this.institutionService.getConclusion(route.parent.params.institutionId, route.parent.params.yearName, 'EDUCATION'),
        this.institutionService.getConclusion(route.parent.params.institutionId, route.parent.params.yearName, 'STAFF')
    ])
   

  }

}
