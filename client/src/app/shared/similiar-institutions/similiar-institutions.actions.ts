import { IInstitution } from './../../interfaces/institution.interface';
import { Action, ActionCreator } from 'redux';

export const SET_SIMILIAR_INSTITUTIONS = '[Similiar-Institutions] set';

export interface SetSimiliarInstitutionsAction extends Action {
    similarInstitutions: number[];
}

export const setSimiliarInnstitutions: 
ActionCreator<SetSimiliarInstitutionsAction> = (similarInstitutions) => ({
    type: SET_SIMILIAR_INSTITUTIONS,
    similarInstitutions: similarInstitutions
})

