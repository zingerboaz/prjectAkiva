import { YearReducer } from './shared/year/year.reducer';
import { InstitutionReducer } from './shared/institution/institution.reducer';
import { IYear } from './interfaces/year.interface';
import { IUser } from './interfaces/user.interface';
import {
 Reducer,
 combineReducers
} from 'redux';


import {UserReducer} from './shared/user/user.reducer';
import {SimilarInstitutionsReducer} from './shared/similiar-institutions/similar-institutions.reducer'
import { IInstitution } from './interfaces/institution.interface';



export * from './shared/user/user.reducer';



export interface AppState {
   user: IUser;
   institution: IInstitution;
   year: IYear;
   similarInstitutions: IInstitution[];

}

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
           user: UserReducer,
           institution: InstitutionReducer,
           year: YearReducer,
           similarInstitutions: SimilarInstitutionsReducer

});

export default rootReducer;
