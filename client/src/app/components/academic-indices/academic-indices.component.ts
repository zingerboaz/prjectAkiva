import { MatSnackBar } from '@angular/material/snack-bar';
import { SiteParams } from './../../interfaces/manager-params.type';
import { AppStore } from './../../app.store';
import { InstitutionService } from 'src/app/services/institution.service';
import { IAcademicsData } from './../../interfaces/academics.interface';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import * as Redux from 'redux';
import { ActivatedRoute } from '@angular/router';
import { AppState } from 'src/app/app.reducer';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { concatMap, skipWhile, take } from 'rxjs/operators';
import { IConclusion } from 'src/app/interfaces/conclusion.interface';
import { IExpect } from 'src/app/interfaces/expect.interface';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-academic-indices',
  templateUrl: './academic-indices.component.html',
  styleUrls: ['./academic-indices.component.scss']
})
export class AcademicIndicesComponent implements OnInit, OnDestroy {
  specialEducationControl: FormControl = new FormControl();
  academicsData: IAcademicsData[];
  conclusionControl: FormControl = new FormControl(null, Validators.required);
    conclusionId: number;
  expectControl: FormGroup = new FormGroup({
    current_expect: new FormGroup({
      eligible: new FormControl(null),
      outstanding: new FormControl(null),
      math_4: new FormControl(null),
      math_5: new FormControl(null),
      eng_4: new FormControl(null),
      eng_5: new FormControl(null)
    }),
    last_expect: new FormGroup({
      eligible: new FormControl(null),
      outstanding: new FormControl(null),
      math_4: new FormControl(null),
      math_5: new FormControl(null),
      eng_4: new FormControl(null),
      eng_5: new FormControl(null)
    })
  })
  input_details = [
    {control:"eligible", header:'זכאים'},
    {control:"outstanding", header:'מצטינים'},
    {control:"math_4", header:'4 יח"ל מתמטיקה'},
    {control:"math_5", header:'5 יח"ל מתמטיקה'},
    {control:"eng_4", header:'4 יח"ל אנגלית'},
    {control:"eng_5", header:'5 יח"ל אנגלית'}];
  activatedRouteSubscrption: Subscription;
  openedExpansion: string = null;
  mode: 'institution' | 'manager';
  uploadForm: FormGroup;
  is_editable_institution: boolean = false;
  institutionId:number;
  yearName:string;


  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private institutionService: InstitutionService,
    private snackBar: MatSnackBar,
    @Inject(AppStore) private store: Redux.Store<AppState>,
    private formBuilder: FormBuilder,
    private location: Location,

  ) { }

  ngOnInit(): void {
    this.setAcademicsData();
    this.is_editable_institution = this.isEditableInstitution();
    this.setMode();
    this.getExpect();
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
    this.activatedRoute.parent.params.subscribe(params => {
      this.institutionId = params.institutionId;
      this.yearName = params.yearName
    });
  }

  ngOnDestroy(): void {
    // this.activatedRouteSubscrption.unsubscribe();
  }

  setAcademicsData() {
    this.activatedRoute.data.subscribe(data => {
      this.academicsData = this.orderacAdemicsData(data['academicsData']);
      console.log('academique data', this.academicsData);
    });
  }

  orderacAdemicsData(_academicDataList: any) {
    var ordered = [];
    _academicDataList.forEach(item => {
      switch (true) {
        case item.name.includes('טוהר בחינות – שקלול דיפרנציאלי'):
          ordered[0] = item;
          item.iconPath = '/assets/images/examination.svg';
          break;
        case item.name.includes('טוהר בחינות - מחברות בחינה פסולות'):
          ordered[1] = item;
          item.iconPath = '/assets/images/examination.svg';
          break;
        case item.name.includes('זכאות לבגרות'):
          if (item.name.includes('מצטיינת')) {
            ordered[3] = item;
            item.iconPath = '/assets/images/cup.svg';
          } else {
            ordered[2] = item;
            item.iconPath = '/assets/images/notebook.svg';
          }
          break;
        case item.name.includes('אנגלית'):
          if (item.name.includes('4')) {
            ordered[4] = item;
            item.iconPath = '/assets/images/book-english.svg';
          } else {
            ordered[5] = item;
            item.iconPath = '/assets/images/book-english.svg';
          }
          break;
        case item.name.includes('מתמטיקה'):
          if (item.name.includes('4')) {
            ordered[6] = item;
            item.iconPath = '/assets/images/maths.svg';
          } else {
            ordered[7] = item;
            item.iconPath = '/assets/images/maths.svg';
          }
          break;
        case item.name.includes('זכאים להסמכה טכנולוגית'):
          ordered[8] = item;
          item.iconPath = '/assets/images/notebook.svg';
          break;
        case item.name.includes('נשירה'):
          ordered[9] = item;
          item.iconPath = '/assets/images/book.svg';
          break;
        case item.name.includes('התמדה'):
          ordered[10] = item;
          item.iconPath = '/assets/images/book.svg';
          break;
        case item.name.includes('מסוגלות, סקרנות ועניין בלמידה'):
          ordered[11] = item;
          item.iconPath = '/assets/images/book.svg';
          break;
        case item.name.includes('פרקטיקות הוראה-למידה-הערכה'):
          ordered[12] = item;
          item.iconPath = '/assets/images/book.svg';
          break;
        case item.name.includes('אסטרטגיות ללמידה עצמית'):
          ordered[13] = item;
          item.iconPath = '/assets/images/book.svg';
          break;
        case item.name.includes('קבלת הערכה ומשוב מקדמי למידה מהמורים'):
          ordered[14] = item;
          item.iconPath = '/assets/images/feedback.svg';
          break;
        case item.name.includes('תנ"ך'):
        case item.name.includes('תנ״ך'):
          ordered[15] = item;
          item.iconPath = '/assets/images/torah_book.svg';
          break;
        case item.name.includes('מחשבת מוגבר'):
          ordered[16] = item;
          item.iconPath = '/assets/images/torah_book.svg';
          break;
        case item.name.includes('תלמוד'):
          ordered[17] = item;
          item.iconPath = '/assets/images/torah_book.svg';
          break;
        case item.name.includes('תושב"ע'):
        case item.name.includes('תושב״ע'):
          ordered[18] = item;
          item.iconPath = '/assets/images/torah_book.svg';
          break;
        default:
          if (ordered.length <= 19) {
            ordered[19] = item;
          } else {
            ordered[ordered.length] = item;
          }
          item.iconPath = '/assets/images/book.svg';
      }
    });
    var filtered = ordered.filter(el => {
      return el != null;
    });
    return filtered;
  }

  setMode() {
    this.activatedRoute.parent.url.pipe(take(1)).subscribe(url => {
      this.mode = <'institution' | 'manager'>url[0].path;
      if (this.is_editable_institution)
        console.log("editable--")
        this.getConclusion();
    });
  }

  manageExpansions(expansionName) {
    this.openedExpansion === expansionName
      ? (this.openedExpansion = null)
      : (this.openedExpansion = expansionName);
  }

  onCheckBoxChange() {
//     if(this.specialEducationControl.value){
//       manageExpansions(this.openedExpansion);
//     }else{}
  }

  getConclusion() {
    this.activatedRoute.parent.params
      .pipe(
        concatMap((params: SiteParams) => {
          return this.institutionService.getConclusion(
            params.institutionId,
            params.yearName,
            'EDUCATION'
          );
        }),
        skipWhile(value => !value)
      )
      .subscribe((conclusion: IConclusion) => {
        if(conclusion != null){
          this.conclusionControl.setValue(conclusion.conclusion);
          this.conclusionId = conclusion.id;
      }});
  }

  getExpect() {
    this.activatedRoute.parent.params
      .pipe(
        concatMap((params: SiteParams) => {
          let value = {
            'current_expect': {
              'eligible': null,
              'outstanding': null,
              'math_4': null,
              'math_5': null,
              'eng_4': null,
              'eng_5': null
            },
            'last_expect': {
              'eligible': null,
              'outstanding': null,
              'math_4': null,
              'math_5': null,
              'eng_4': null,
              'eng_5': null
            }
          }
          this.expectControl.setValue(value);
          return this.institutionService.getExpect(
            params.institutionId,
          );
        }),
        skipWhile(value => !value)
      )
      .subscribe((expect: IExpect) => {
        if(expect != null){
          let value = {
            'current_expect': {
              'eligible': expect.current_eligible,
              'outstanding': expect.current_outstanding,
              'math_4': expect.current_math_4,
              'math_5': expect.current_math_5,
              'eng_4': expect.current_eng_4,
              'eng_5': expect.current_eng_5
            },
            'last_expect': {
              'eligible': expect.last_eligible,
              'outstanding': expect.last_outstanding,
              'math_4': expect.last_math_4,
              'math_5': expect.last_math_5,
              'eng_4': expect.last_eng_4,
              'eng_5': expect.last_eng_5
            }
          }
          this.expectControl.setValue(value);
      }});
  }

  onSaveConclusion() {
    console.log(this.conclusionControl.value);
    this.institutionService.updateOrCreateConclusion(
          this.institutionId,
          this.yearName,
          'EDUCATION',
          this.conclusionControl.value,
          this.conclusionId
        ).subscribe(response => {
      if (response) {
        this.snackBar.open('הנתונים עודכנו בהצלחה', '', {
          duration: 3000
        });
      }
    });
  }

  onSaveExpect() {
    console.log(this.expectControl.value);
    this.institutionService.updateOrCreateExpect(
            this.institutionId,
            this.expectControl.value
          ).subscribe(response => {
        if (response) {
          this.snackBar.open('צפי עודכן בהצלחה', '', {
            duration: 3000
          });
        }
      });
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

  onFileSelect(event) {
    console.log('event', event);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('profile').setValue(file);
    }
  }

  onSubmit() {
    const formData = new FormData();
    var currentInstitution = this.store.getState().institution;
    formData.append('data_file', this.uploadForm.get('profile').value);
    formData.append('semel_mosad', currentInstitution.semel)
    return this.institutionService.uploadExcel(formData).subscribe(response => {
      console.log('onSubmit success', response)
      if (response) {
        this.snackBar.open('הנתונים עודכנו בהצלחה', '', {
          duration: 3000
        });
        location.reload();
      }
    });
  }
}

