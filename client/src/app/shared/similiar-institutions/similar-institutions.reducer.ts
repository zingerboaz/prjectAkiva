import { IInstitution } from '../../interfaces/institution.interface';
import { Action } from 'redux';
import * as SimilarInstitutionsActions from './similiar-institutions.actions';
import { SharedReducer } from '../shared-reducer/shared.reducer';

const initialState: IInstitution[] = null;

export const SimilarInstitutionsReducer = function (
    state: IInstitution[] = initialState,
    action: Action
): IInstitution[] {
    let similarInstitutions;
    switch(action.type){
        case SimilarInstitutionsActions.SET_SIMILIAR_INSTITUTIONS:
            similarInstitutions = (<SimilarInstitutionsActions.SetSimiliarInstitutionsAction>action).similarInstitutions;
            return similarInstitutions;
        default:
            if((<any>action).objType && (<any>action).objType === 'similar-institutions') {
                state = SharedReducer(state, action);
            }
            return state;
    }
}
