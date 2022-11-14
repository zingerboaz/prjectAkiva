import { SiteParams } from './../../interfaces/manager-params.type';
import { concatMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AppState } from 'src/app/app.reducer';
import { InstitutionService } from 'src/app/services/institution.service';
import { IInstitutionGeneralData } from './../../interfaces/institution-general-data.interface';
import { Component, Inject, OnInit } from '@angular/core';
import * as Redux from 'redux';
import { AppStore } from 'src/app/app.store';

@Component({
  selector: 'app-institution-layout',
  templateUrl: './institution-layout.component.html',
  styleUrls: ['./institution-layout.component.scss']
})
export class InstitutionLayoutComponent implements OnInit {
  institutionGeneralInfo: IInstitutionGeneralData;

  constructor(private institutionService: InstitutionService,
    @Inject(AppStore) private store: Redux.Store<AppState>,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.setInstitutionGeneralInfo();
  }

  setInstitutionGeneralInfo() {
    this.activatedRoute.params.pipe(concatMap((params: SiteParams) => {
      return this.institutionService.getInstitutionGeneralDataByYear(
        params.institutionId, params.yearName)
    })).subscribe(institutionInfo => {
        this.institutionGeneralInfo = institutionInfo
      })

  }

//   document.getElementById('avatar_form').addEventListener('submit', function(event) {
//     event.preventDefault();
//     let input = document.getElementById('id_avatar');
//
//     let data = new FormData();
//     data.append('avatar', input.files[0]);
//
//     fetch('http://127.0.0.1:8000/api/user-avatar/', {
//         method: 'POST',
// //         headers: {
// //             'Authorization': `Token ${userToken}`
// //         },
//         body: data
//     }).then(response => {
//         return response.json();
//     }).then(data => {
//         console.log(data);
//     }).catch((error) => {
//         console.error('Error:', error);
//     });
// });
}
