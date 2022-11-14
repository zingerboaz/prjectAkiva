import { Action, ActionCreator } from 'redux';
import { IInstitution } from '../../interfaces/institution.interface';

export const SET_INSTITUTION = '[Institution] set';

export interface SetInstitutionAction extends Action {
  institution: IInstitution;
}

export const setInstitution: ActionCreator<SetInstitutionAction> = (
  institution
) => ({
  type: SET_INSTITUTION,
  institution: institution,
});
