import { SiteParams } from './../../interfaces/manager-params.type';
import { ActivatedRoute } from '@angular/router';
import { concatMap } from 'rxjs/operators';
import { IInstitution } from './../../interfaces/institution.interface';
import { InstitutionService } from './../../services/institution.service';
import { Component, OnInit, Inject } from '@angular/core';
import { IInstitutionGeneralData } from '../../interfaces/institution-general-data.interface';
import * as Redux from 'redux';
import { AppState } from '../../app.reducer';
import { AppStore } from '../../app.store';
import { FormGroup, FormControl } from '@angular/forms';
import * as SimiliarInstitutinsActions from 'src/app/shared/similiar-institutions/similiar-institutions.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
})
export class GeneralInfoComponent implements OnInit {
  formGroup: FormGroup;
  institutionData: IInstitutionGeneralData;
  institutionsList: IInstitution[];
  currentInstitutionData: IInstitutionGeneralData;

  constructor(
    private institutionService: InstitutionService,
    private activatedRoute: ActivatedRoute,
    @Inject(AppStore) private store: Redux.Store<AppState>,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.setInstitutionData();
    this.setCurrentInstitutionData();
    this.setInstitutionsList();
  }

  setCurrentInstitutionData() {
    this.activatedRoute.data.subscribe((data) => {
      console.log('data', data['institutionData']);
      this.currentInstitutionData = data['institutionData'];
      this.initForm();
    });
    console.log('institution general info', this.currentInstitutionData);
  }

  setInstitutionsList() {
    this.institutionService
      .getInstitutionsList()
      .subscribe((institutionsList) => {
        this.institutionsList = <IInstitution[]>institutionsList;
      });
  }

  initForm() {
    this.formGroup = new FormGroup({
      similarInstitutions: new FormControl(
        this.store.getState().similarInstitutions
      ),
    });
  }

  setInstitutionData() {
    this.activatedRoute.data.subscribe((data) => {
      console.log('data', data);
      this.institutionData = data['institutionData'];
      for (var i = 0; i < this.institutionData.programs.length; i++) {
        var title = "";
        switch (this.institutionData.programs[i].program_type) {
          case 'plan_1':
            title = 'תחום תורני'
            break
          case 'plan_2':
            title = 'תחום חינוכי'
            break
          case 'plan_3':
            title = 'תחום חברתי'
            break

        }
        this.institutionData.programs[i].title = title
      }
      console.log('instition Data', this.institutionData);
    });
  }

  onClickToMisradHaChinuch(semel: string) {
    window.open('https://shkifut.education.gov.il/school/' + semel, '_blank');
  }

  onClickToTohnitMenael(){
    window.open('https://menahel.yba.org.il/Home/Login.aspx', '_blank');
  }

  onSave() {
    let similarInstitutions: IInstitution[] = [];
    (<IInstitution[]>(
      this.formGroup.controls['similarInstitutions'].value
    )) ?.forEach((item) => {
      similarInstitutions.push(item);
    });
    this.store.dispatch(
      SimiliarInstitutinsActions.setSimiliarInnstitutions(
        similarInstitutions.length ? similarInstitutions : null
      )
    );
    if (similarInstitutions.length) {
      this.snackBar.open('הנתונים עודכנו בהצלחה', '', {
        duration: 3000,
      });
    } else {
      this.snackBar.open('הכנס מוסדות להשוואה', '', {
        duration: 3000,
      });
    }
  }
}
