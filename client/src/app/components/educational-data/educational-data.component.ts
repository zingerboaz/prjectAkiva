import { IConclusion } from './../../interfaces/conclusion.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { SiteParams } from './../../interfaces/manager-params.type';
import { IEducationalData } from './../../interfaces/educational-data.interface';
import { concatMap, skipWhile, take } from 'rxjs/operators';
import { InstitutionService } from 'src/app/services/institution.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppStore } from 'src/app/app.store';
import { AppState } from 'src/app/app.reducer';
import * as Redux from 'redux';
import { of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-educational-data',
  templateUrl: './educational-data.component.html',
  styleUrls: ['./educational-data.component.scss']
})
export class EducationalDataComponent implements OnInit {
  educationalData: IEducationalData[];
  conclusionControl: FormControl = new FormControl();
  conclusionId: number = null;
  icons = [
    '/assets/images/relationship 1.png',
    '/assets/images/friendship 1.png',
    '/assets/images/heart 1.png',
    '/assets/images/fist 1.png',
    '/assets/images/relationship.png',
    '/assets/images/like 1.png'
  ]
  openedExpansion: string = null;
  mode: 'institution' | 'manager';
  uploadForm: FormGroup;
  is_editable_institution: boolean = true;


  constructor(
    private activatedRoute: ActivatedRoute,
    private institutionService: InstitutionService,
    private snackBar: MatSnackBar,
    @Inject(AppStore) private store: Redux.Store<AppState>,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.setEducationalData();
    this.is_editable_institution = this.isEditableInstitution();
    this.setMode();
  }

  setEducationalData() {
    this.activatedRoute.data.subscribe(data => {
      this.educationalData = data["educationalData"];
      this.educationalData.forEach((item, index) => {
        item.iconPath = this.icons[index]
      })
      console.log('educational data', this.educationalData);
    })
  }

  setMode() {
    this.activatedRoute.parent.url.pipe(take(1)).subscribe(url => {
      this.mode = <'institution' | 'manager'>(url[0].path);
      if (this.is_editable_institution){
        console.log("editable--")
        this.getConclusion();
      }
    });
  }

  manageExpansions(expansionName) {
    this.openedExpansion === expansionName
      ? (this.openedExpansion = null)
      : (this.openedExpansion = expansionName);

  }

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

  getConclusion() {
    this.activatedRoute.parent.params.pipe(
      concatMap((params: SiteParams) => {
        return this.institutionService.getConclusion(
          params.institutionId,
          params.yearName,
          'SOCIAL'
        )
      }),
      skipWhile(value => !value)
    ).subscribe((conclusion: IConclusion) => {
      if(conclusion != null){
        this.conclusionControl.setValue(conclusion.conclusion)
        this.conclusionId = conclusion.id;
      }})

  }

  onSaveConclusion() {
    console.log(this.conclusionControl.value)
    this.activatedRoute.parent.params.pipe(
      concatMap((params: SiteParams) => {
        return this.institutionService.updateOrCreateConclusion(
          params.institutionId,
          params.yearName,
          'SOCIAL',
          this.conclusionControl.value,
          this.conclusionId
        )

      })
    ).subscribe(response => {
      if (response) {
        this.snackBar.open('הנתונים עודכנו בהצלחה', '', {
          duration: 3000,
        });
      }
    })
  }
}
