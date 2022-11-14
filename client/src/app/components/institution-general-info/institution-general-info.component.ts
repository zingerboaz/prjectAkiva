import { SiteParams } from './../../interfaces/manager-params.type';
import { concatMap } from 'rxjs/operators';
import { IInstitution } from './../../interfaces/institution.interface';
import { InstitutionService } from 'src/app/services/institution.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, Inject, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IInstitutionGeneralData } from 'src/app/interfaces/institution-general-data.interface';
import { AppState } from 'src/app/app.reducer';
import { AppStore } from 'src/app/app.store';
import * as Redux from 'redux';
import * as SimiliarInstitutinsActions from 'src/app/shared/similiar-institutions/similiar-institutions.actions';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-institution-general-info',
  templateUrl: './institution-general-info.component.html',
  styleUrls: ['./institution-general-info.component.scss']
})
export class InstitutionGeneralInfoComponent implements OnInit {
  formGroup: FormGroup;
  currentInstitutionData: IInstitutionGeneralData;
  institutionsList: IInstitution[];
  @ViewChild(MatAccordion) accordion: MatAccordion;
  panelOpenState: Boolean = false;
  institutionDataPrograms: any;
  institutionData: IInstitutionGeneralData;


  plans: any[] = [
    {
      numPlan: 'firstPlan',
      name: 'תחום תורני- פרט בקצרה תוכנית דגל אחת שמתקיימת במוסד בתחום זה',
      name_of_program: 'שם התוכנית',
      goal_of_program: 'מטרת התוכנית',
      target_audience: 'קהל היעד',
      regularity: 'סדירות',
      success_factors: 'מדדי הצלחה'
    },
    {
      numPlan: 'secondPlan',
      name: 'תחום חינוכי- פרט בקצרה תוכנית דגל אחת שמתקיימת במוסד בתחום זה',
      name_of_program: 'שם התוכנית',
      goal_of_program: 'מטרת התוכנית',
      target_audience: 'קהל היעד',
      regularity: 'סדירות',
      success_factors: 'מדדי הצלחה'
    },
    {
      numPlan: 'thirdPlan',
      name: 'תחום חברתי- פרט בקצרה תוכנית דגל אחת שמתקיימת במוסד בתחום זה',
      name_of_program: 'שם התוכנית',
      goal_of_program: 'מטרת התוכנית',
      target_audience: 'קהל היעד',
      regularity: 'סדירות',
      success_factors: 'מדדי הצלחה'
    }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private institutionService: InstitutionService,
    @Inject(AppStore) private store: Redux.Store<AppState>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.setCurrentInstitutionData();
    this.setInstitutionsList();
    this.setInstitutionData();
    console.log('institution datat', this.institutionData.institution.inspector);
    
  }

  onClickToMisradHaChinuch(semel: string) {
    window.open('https://shkifut.education.gov.il/school/' + semel, '_blank');
  }

  onClickToTohnitMenael(){
    window.open('https://menahel.yba.org.il/Home/Login.aspx', '_blank');
  }

  setCurrentInstitutionData() {
    this.activatedRoute.data.subscribe(data => {
      this.currentInstitutionData = data['institutionData'];
      this.institutionData = data['institutionData'];
    });
    console.log('institution general info', this.currentInstitutionData);
  }

  setInstitutionsList() {
    this.institutionService
      .getInstitutionsList()
      .subscribe(institutionsList => {
        this.institutionsList = <IInstitution[]>institutionsList;
      });
  }

  setInstitutionData() {
    this.activatedRoute.data.subscribe(data => {
      console.log('data', data);
      this.institutionDataPrograms = data['institutionData'].programs;
      if(this.institutionDataPrograms.length < 3){
        var plansToCreate = this.getPlansToCreate(this.institutionDataPrograms)
        for(var i = 0; i < plansToCreate.length; i++){
          var plan : any = {}
          plan.program_type = plansToCreate[i]
          this.institutionDataPrograms.push(plan)
        }
      }
       for(var i = 0; i < this.institutionDataPrograms.length; i++){
          this.institutionDataPrograms[i].default = this.plans[i]
       }
      console.log('instition Data', this.institutionDataPrograms);
      this.initForm();
    });
  }

  getPlansToCreate(programs: any[]){
    var plans = ['plan_1', 'plan_2', 'plan_3']
    var toreturn = []
    for(var i = 0; i < programs.length; i++){
      for(var j = 0; j < plans.length; j++){
        if(programs[i].program_type == plans[j]){
          plans.splice(j, 1)
          break
        }
      }
    }
    console.log(plans)
    return plans
  }

  initForm() {
    this.formGroup = new FormGroup({
      institution_strength: new FormControl(
        this.currentInstitutionData.institution_strength,
        [Validators.required]
      ),
      institution_story: new FormControl(
        this.currentInstitutionData.institution_story,
        [Validators.required]
      ),
      institution_challenge: new FormControl(
        this.currentInstitutionData.institution_challenge,
        [Validators.required]
      ),
      similarInstitutions: new FormControl(
        this.store.getState().similarInstitutions
      ),

      firstPlan: new FormGroup({
        name_of_program: new FormControl(
          this.getProgramByType('plan_1', this.institutionDataPrograms).name
        ),
        goal_of_program: new FormControl(
          this.getProgramByType('plan_1', this.institutionDataPrograms).purpose
        ),
        target_audience: new FormControl(
          this.getProgramByType('plan_1', this.institutionDataPrograms).target_audience
        ),
        regularity: new FormControl(this.getProgramByType('plan_1', this.institutionDataPrograms).regularity),
        success_factors: new FormControl(
          this.getProgramByType('plan_1', this.institutionDataPrograms).success_factors
        )
      }),

      secondPlan: new FormGroup({
        name_of_program: new FormControl(
          this.getProgramByType('plan_2', this.institutionDataPrograms).name
        ),
        goal_of_program: new FormControl(
          this.getProgramByType('plan_2', this.institutionDataPrograms).purpose
        ),
        target_audience: new FormControl(
          this.getProgramByType('plan_2', this.institutionDataPrograms).target_audience
        ),
        regularity: new FormControl(this.getProgramByType('plan_2', this.institutionDataPrograms).regularity),
        success_factors: new FormControl(
          this.getProgramByType('plan_2', this.institutionDataPrograms).success_factors
        )
      }),

      thirdPlan: new FormGroup({
        name_of_program: new FormControl(
          this.getProgramByType('plan_3', this.institutionDataPrograms).name
        ),
        goal_of_program: new FormControl(
          this.getProgramByType('plan_3', this.institutionDataPrograms).purpose
        ),
        target_audience: new FormControl(
          this.getProgramByType('plan_3', this.institutionDataPrograms).target_audience
        ),
        regularity: new FormControl(this.getProgramByType('plan_3', this.institutionDataPrograms).regularity),
        success_factors: new FormControl(
          this.getProgramByType('plan_3', this.institutionDataPrograms).success_factors)
      })
    });
  }

  getProgramByType(requestedType: string, programs: any[]){
    for(var i = 0; i < programs.length; i++){
      if(programs[i].program_type == requestedType){
        return programs[i]
      }
    }
  }

  onSave() {
    console.log('dddddddddd', this.formGroup.value);
    this.activatedRoute.parent.params
      .pipe(
        concatMap((params: SiteParams) => {
          return this.institutionService.updateStoryAndStrength({
            institutionId: params.institutionId,
            yearName: params.yearName,
            story: this.formGroup.controls['institution_story'].value,
            strength: this.formGroup.controls['institution_strength'].value,
            challenge: this.formGroup.controls['institution_challenge'].value,
            name_of_program_1: this.formGroup.get('firstPlan.name_of_program')
              .value,
            goal_of_program_1: this.formGroup.get('firstPlan.goal_of_program')
              .value,
            target_audience_1: this.formGroup.get('firstPlan.target_audience')
              .value,
            regularity_1: this.formGroup.get('firstPlan.regularity').value,
            success_factors_1: this.formGroup.get('firstPlan.success_factors')
              .value,
            name_of_program_2: this.formGroup.get('secondPlan.name_of_program')
              .value,
            goal_of_program_2: this.formGroup.get('secondPlan.goal_of_program')
              .value,
            target_audience_2: this.formGroup.get('secondPlan.target_audience')
              .value,
            regularity_2: this.formGroup.get('secondPlan.regularity').value,
            success_factors_2: this.formGroup.get('secondPlan.success_factors')
              .value,
            name_of_program_3: this.formGroup.get('thirdPlan.name_of_program')
              .value,
            goal_of_program_3: this.formGroup.get('thirdPlan.goal_of_program')
              .value,
            target_audience_3: this.formGroup.get('thirdPlan.target_audience')
              .value,
            regularity_3: this.formGroup.get('thirdPlan.regularity').value,
            success_factors_3: this.formGroup.get('thirdPlan.success_factors')
              .value
          });
        })
      )
      .subscribe(response => {
        console.log('response', response);

        if (response) {
          this.snackBar.open('הנתונים עודכנו בהצלחה', '', {
            duration: 3000
          });
        }
      });
    let similarInstitutions: IInstitution[] = [];
    (<IInstitution[]>(
      this.formGroup.controls['similarInstitutions'].value
    ))?.forEach(item => {
      similarInstitutions.push(item);
    });
    this.store.dispatch(
      SimiliarInstitutinsActions.setSimiliarInnstitutions(
        similarInstitutions.length ? similarInstitutions : null
      )
    );
  }

  navigetToministeryOfEducationSite() {
    window.open('https://edu.gov.il/owlheb/Pages/default.aspx', '_blank');
  }
}
