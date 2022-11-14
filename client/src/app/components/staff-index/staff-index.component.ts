import { MatSnackBar } from '@angular/material/snack-bar';
import { SiteParams } from './../../interfaces/manager-params.type';
import { concatMap, skipWhile, take } from 'rxjs/operators';
import { AppState } from './../../app.reducer';
import { InstitutionService } from 'src/app/services/institution.service';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import * as Redux from 'redux';
import { AppStore } from 'src/app/app.store';
import { IStaffData } from 'src/app/interfaces/staff-data.interface';
import { FormControl } from '@angular/forms';
import { IConclusion } from 'src/app/interfaces/conclusion.interface';

@Component({
  selector: 'app-staff-index',
  templateUrl: './staff-index.component.html',
  styleUrls: ['./staff-index.component.scss'],
})
export class StaffIndexComponent implements OnInit {
  staffData: IStaffData[];
  conclusionControl: FormControl = new FormControl();
  noteControl: FormControl = new FormControl();
  conclusionId: number;
  noteId: number;
  icons = [
    '/assets/images/community.svg',
    '/assets/images/mental-health.svg',
    '/assets/images/satisfaction.svg',
    '/assets/images/support.svg',
  ];
  openedExpansion: string = null;
  mode: 'institution' | 'manager';
  is_editable_institution: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private institutionService: InstitutionService,
    private snackBar: MatSnackBar,
    @Inject(AppStore) private store: Redux.Store<AppState>
  ) {}

  ngOnInit(): void {
    this.setStaffData();
    this.is_editable_institution = this.isEditableInstitution();
    this.setMode();
  }

  setStaffData() {
    this.activatedRoute.data.subscribe((data) => {
      this.staffData = data['staffData'];
      this.staffData.forEach((item, index) => {
        item.iconPath = this.icons[index];
      });
      console.log('staf data', this.staffData);
    });
  }

  setMode() {
    this.activatedRoute.parent.url.pipe(take(1)).subscribe((url) => {
      this.mode = <'institution' | 'manager'>url[0].path;
      if (this.is_editable_institution){
        console.log("editable--")
        this.getConclusion();
        this.getNote();
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
    console.log('getConclusion');
    this.activatedRoute.parent.params
      .pipe(
        concatMap((params: SiteParams) => {
          return this.institutionService.getConclusion(
            params.institutionId,
            params.yearName,
            'STAFF',
          );
        }),
        skipWhile((value) => !value)
      )
      .subscribe((conclusion: IConclusion) => {
        this.conclusionControl.setValue(conclusion.conclusion);
        this.conclusionId = conclusion.id;
      });
  }

  getNote() {
    console.log('getNote');
    this.activatedRoute.parent.params
      .pipe(
        concatMap((params: SiteParams) => {
          return this.institutionService.getNote(
            params.institutionId,
            params.yearName,
            'STAFF_2',
          );
        }),
        skipWhile((value) => !value)
      )
      .subscribe((note: IConclusion) => {
        this.noteControl.setValue(note.conclusion);
        this.noteId = note.id;
      });
  }

  onSaveConclusion() {
    console.log(this.conclusionControl.value);
    this.activatedRoute.parent.params
      .pipe(
        concatMap((params: SiteParams) => {
          return this.institutionService.updateOrCreateConclusion(
            params.institutionId,
            params.yearName,
            'STAFF',
            this.conclusionControl.value,
            this.conclusionId
          );
        })
      )
      .subscribe((response) => {
        if (response) {
          this.snackBar.open('הנתונים עודכנו בהצלחה', '', {
            duration: 3000,
          });
        }
      });
  }

  onSaveNote() {
    this.activatedRoute.parent.params
      .pipe(
        concatMap((params: SiteParams) => {
          return this.institutionService.updateOrCreateConclusion(
            params.institutionId,
            params.yearName,
            'STAFF_2',
            this.noteControl.value,
            this.noteId
          );
        })
      )
      .subscribe((response) => {
        if (response) {
          this.snackBar.open('הנתונים עודכנו בהצלחה', '', {
            duration: 3000,
          });
        }
      });
  }
}
