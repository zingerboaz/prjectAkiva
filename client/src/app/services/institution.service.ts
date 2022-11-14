import { IParticipationData } from './../interfaces/participation.interface';
import {
  IConclusion,
  IUpdateConclusion,
} from '../interfaces/conclusion.interface';
import {
  IExpect,
  IUpdateExpect,
} from '../interfaces/expect.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IYearGoal, IYearGoals } from './../interfaces/yearGoal.interface';
import { IAcademicsData } from './../interfaces/academics.interface';
import { IEducationalData } from './../interfaces/educational-data.interface';
import { AppStore } from './../app.store';
import {
  IInstitutionGeneralData,
  IIUpdateGeneralInfoResponse,
  IUpdateGeneralInfo,
} from './../interfaces/institution-general-data.interface';
import { IInstitution } from './../interfaces/institution.interface';
import { IYear } from '../interfaces/year.interface';
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import * as Redux from 'redux';
import { AppState } from '../app.reducer';
import * as InstitutionActions from 'src/app/shared/institution/institution.actions';
import * as YearActions from 'src/app/shared/year/year.actions';
import { IStaffData } from '../interfaces/staff-data.interface';
import { ProgressBarService } from './progress-bar.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DataTypesEnum } from './data-types.enum';

@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  constructor(
    private http: HttpClient,
    @Inject(AppStore) private store: Redux.Store<AppState>,
    private progressBarService: ProgressBarService,
    private snackBar: MatSnackBar
  ) {}

  getInstitutionsList(): Observable<IInstitution[]> {
    return this.http
      .get<IInstitution[]>(`${environment.apiUrl}/institutions`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('טעינת נתונים נכשלה', '', {
            duration: 3000,
          });
          this.progressBarService.off();
          return of(null);
        })
      );
  }

  getYearListByInstitution(institutionId: number): Observable<IYear[]> {
    return this.http
      .get<IInstitutionGeneralData[]>(
        `${environment.apiUrl}/institution_details/` + institutionId
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('טעינת נתונים נכשלה', '', {
            duration: 3000,
          });
          this.progressBarService.off();
          return of(null);
        }),
        map((listOfData: IInstitutionGeneralData[]) => {
          let yearArr: IYear[] = [];
          listOfData.forEach((item) => {
            item.year.fullName = item.year.hebrew_name + ' ' + item.year.name;
            yearArr.push(item.year);
          });
          return yearArr;
        })
      );
  }

  updateCurrentInstitutionInStore(institution: IInstitution) {
    this.store.dispatch(InstitutionActions.setInstitution(institution));
  }

  updateCurrentYearInStore(year: IYear) {
    this.store.dispatch(YearActions.setYear(year));
  }

  getInstitutionGeneralDataByYear(
    institutionId: number,
    yearName: string
  ): Observable<IInstitutionGeneralData> {
    return this.http
      .post<IInstitutionGeneralData[]>(
        `${environment.apiUrl}/institution_details`,
        {
          institution_id: institutionId,
          year_name: yearName,
        }
      )
      .pipe(
        map((institutionData) => {
          return institutionData.filter((item) => {
            return item.year.name == yearName;
          })[0];
        }),
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('טעינת נתונים נכשלה', '', {
            duration: 3000,
          });
          this.progressBarService.off();
          return of(null);
        })
      );
  }

  updateStoryAndStrength({
    institutionId,
    yearName,
    story,
    strength,
    challenge,
    name_of_program_1,
    goal_of_program_1,
    target_audience_1,
    regularity_1,
    success_factors_1,
    name_of_program_2,
    goal_of_program_2,
    target_audience_2,
    regularity_2,
    success_factors_2,
    name_of_program_3,
    goal_of_program_3,
    target_audience_3,
    regularity_3,
    success_factors_3,
  }: any): Observable<any> {
    let body: any = {
      institution_id: institutionId,
      year: yearName,
      story: story,
      strength: strength,
      challenge: challenge,
      plan_1: {
        name_of_program : name_of_program_1,
        goal_of_program : goal_of_program_1,
        target_audience : target_audience_1,
        regularity : regularity_1,
        success_factors : success_factors_1,
      },
      plan_2: {
        name_of_program : name_of_program_2,
        goal_of_program : goal_of_program_2,
        target_audience : target_audience_2,
        regularity : regularity_2,
        success_factors : success_factors_2,
      },
      plan_3: {
        name_of_program : name_of_program_3,
        goal_of_program : goal_of_program_3,
        target_audience : target_audience_3,
        regularity : regularity_3,
        success_factors : success_factors_3,
      },
    };
    return this.http
      .put<IIUpdateGeneralInfoResponse>(
        environment.apiUrl + '/institution_details/story&strength',
        body
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('טעינת נתונים נכשלה', '', {
            duration: 3000,
          });
          this.progressBarService.off();
          return of(null);
        }),
        map((response) => {
          if (response.message) return response.data;
          else return null;
        })
      );
  }

  getIndicesTypeAvailableYears(
    institutionId: number,
    indicesType: DataTypesEnum
  ): Observable<any> {
    const requestUrl = environment.apiUrl + '/indices/available_years';
    const requestBody = {
      institution_id: institutionId,
      data_type: indicesType.toString(),
    };
    return this.http.post<any>(requestUrl, requestBody);
  }

  getEducationalData(
    institutionId: number,
    yearName: string,
    similarInstitutions: number[]
  ): Observable<IEducationalData[]> {
    let body = similarInstitutions
      ? {
          institution_id: institutionId,
          year: yearName,
          selected_institutions: similarInstitutions,
        }
      : { institution_id: institutionId, year: yearName };
    return this.http
      .post<IEducationalData[]>(environment.apiUrl + '/indices/social', body)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('טעינת נתונים נכשלה', '', {
            duration: 3000,
          });
          this.progressBarService.off();
          return of(null);
        })
      );
  }

  getAcademicsData(
    institutionId: number,
    yearName: string,
    similarInstitutions: number[]
  ): Observable<IAcademicsData[]> {
    let body = similarInstitutions
      ? {
          institution_id: institutionId,
          year: yearName,
          selected_institutions: similarInstitutions,
        }
      : { institution_id: institutionId, year: yearName };
    return this.http
      .post<IAcademicsData[]>(environment.apiUrl + '/indices/education', body)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('טעינת נתונים נכשלה', '', {
            duration: 3000,
          });
          this.progressBarService.off();
          return of(null);
        })
      );
  }

  getParticipationData(
    institutionId: number,
    yearName: string
  ): Observable<IParticipationData[]> {
    return this.http
      .post<IParticipationData[]>(
        environment.apiUrl + '/indices/participation',
        { institution_id: institutionId, year: yearName }
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('טעינת נתונים נכשלה', '', {
            duration: 3000,
          });
          this.progressBarService.off();
          return of(null);
        })
      );
  }

  getStaffData(
    institutionId: number,
    yearName: string,
    similarInstitutions: number[]
  ): Observable<IStaffData[]> {
    let body = similarInstitutions
      ? {
          institution_id: institutionId,
          year: yearName,
          selected_institutions: similarInstitutions,
        }
      : { institution_id: institutionId, year: yearName };
    return this.http
      .post<IStaffData[]>(environment.apiUrl + '/indices/staff', body)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('טעינת נתונים נכשלה', '', {
            duration: 3000,
          });
          this.progressBarService.off();
          return of(null);
        })
      );
  }

  getYearGoals(institutionId: number, year: string) {
    return this.http
      .post<IYearGoal[]>(environment.apiUrl + '/goals', {
        institution_id: institutionId,
        year_name: year,
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('טעינת נתונים נכשלה', '', {
            duration: 3000,
          });
          this.progressBarService.off();
          return of(null);
        })
      );
  }

  updateYearGoals(yearGoals: IYearGoals): Observable<boolean> {
    return this.http.put(environment.apiUrl + '/goals/update', yearGoals).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error(err);
        this.snackBar.open('עדכון הנתונים נכשל', '', {
          duration: 3000,
        });
        this.progressBarService.off();
        return of(null);
      }),
      map((response) => {
        return !!response.status;
      })
    );
  }

  getConclusion(
    institutionId: number,
    yearName: string,
    indiceType: 'SOCIAL' | 'EDUCATION' | 'STAFF' | 'STAFF_2'
  ): Observable<IConclusion> {
    return this.http
      .post<IConclusion>(environment.apiUrl + '/indices/conclusion', {
        institution_id: institutionId,
        year_name: yearName,
        indice_type: indiceType,
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('טעינת מסקנה נכשלה', '', {
            duration: 3000,
          });
          this.progressBarService.off();
          return of(null);
        })
      );
  }

  getExpect(
    institutionId: number,
  ): Observable<IExpect> {
    return this.http
      .post<IExpect>(environment.apiUrl + '/expect', {
        institution_id: institutionId
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('טעינת צפי נכשלה', '', {
            duration: 3000,
          });
          this.progressBarService.off();
          return of(null);
        })
      );
  }

  getNote(
    institutionId: number,
    yearName: string,
    indiceType: 'SOCIAL' | 'EDUCATION' | 'STAFF' | 'STAFF_2'
  ): Observable<IConclusion> {
    return this.http
      .post<IConclusion>(environment.apiUrl + '/indices/conclusion', {
        institution_id: institutionId,
        year_name: yearName,
        indice_type: indiceType,
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('טעינת מסקנה נכשלה', '', {
            duration: 3000,
          });
          this.progressBarService.off();
          return of(null);
        })
      );
  }

  updateOrCreateConclusion(
    institutionId: number,
    yearName: string,
    indiceType: 'SOCIAL' | 'EDUCATION' | 'STAFF' | 'STAFF_2',
    conclusionContent: string,
    conclusionId: number
  ): Observable<boolean> {
    let body: IUpdateConclusion = conclusionId
      ? {
          institution_id: institutionId,
          year_name: yearName,
          indice_type: indiceType,
          conclusion: {
            id: conclusionId,
            content: conclusionContent,
          },
        }
      : {
          institution_id: institutionId,
          year_name: yearName,
          indice_type: indiceType,
          conclusion: {
            content: conclusionContent,
          },
        };

    return this.http
      .put(environment.apiUrl + '/indices/conclusion/update', body)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('עדכון הנתונים נכשל', '', {
            duration: 3000,
          });
          this.progressBarService.off();
          return of(null);
        }),
        map((response) => {
          return !!response?.message;
        })
      );
  }

  updateOrCreateExpect(
    institutionId: number,
    expect: any,
  ): Observable<boolean> {
    let body: IUpdateExpect = institutionId
      ? {
        institution_id: institutionId,
        expect: {
          current_eligible: expect.current_expect.eligible,
          current_outstanding: expect.current_expect.outstanding,
          current_math_4: expect.current_expect.math_4,
          current_math_5: expect.current_expect.math_5,
          current_eng_4: expect.current_expect.eng_4,
          current_eng_5: expect.current_expect.eng_5,
          last_eligible: expect.last_expect.eligible,
          last_outstanding: expect.last_expect.outstanding,
          last_math_4: expect.last_expect.math_4,
          last_math_5: expect.last_expect.math_5,
          last_eng_4: expect.last_expect.eng_4,
          last_eng_5: expect.last_expect.eng_5,
          }
        }
      : {
        institution_id: institutionId,
        expect: {
            current_eligible: expect.current_expect.eligible,
            current_outstanding: expect.current_expect.outstanding,
            current_math_4: expect.current_expect.math_4,
            current_math_5: expect.current_expect.math_5,
            current_eng_4: expect.current_expect.eng_4,
            current_eng_5: expect.current_expect.eng_5,
            last_eligible: expect.last_expect.eligible,
            last_outstanding: expect.last_expect.outstanding,
            last_math_4: expect.last_expect.math_4,
            last_math_5: expect.last_expect.math_5,
            last_eng_4: expect.last_expect.eng_4,
            last_eng_5: expect.last_expect.eng_5,
            }
          };

    return this.http
      .put(environment.apiUrl + '/expect/update', body)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('עדכון צפי נכשל', '', {
            duration: 3000,
          });
          this.progressBarService.off();
          return of(null);
        }),
        map((response) => {
          return !!response?.message;
        })
      );
  }

  uploadExcel( formData: FormData ) {
    return this.http
      .post<any>(environment.apiUrl + '/institutions/indice_torani', formData)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('עדכון הנתונים נכשל', '', {
            duration: 3000,
          });
          this.progressBarService.off();
          return of(null);
        }),
        map((response) => {
          console.log(response)
          return response;
        })
      );
  }
}
