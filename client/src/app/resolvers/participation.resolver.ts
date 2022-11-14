import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import {  Observable } from 'rxjs';
import { InstitutionService } from '../services/institution.service';
import { IParticipationData } from '../interfaces/participation.interface';
@Injectable(
  { providedIn: 'root' }
)
export class ParticipationResolver implements Resolve<any>{

  constructor(private institutionService: InstitutionService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
  : Observable<IParticipationData[]> {
    return this.institutionService.getParticipationData(route.parent.params.institutionId, route.parent.params.yearName)
  }

}
