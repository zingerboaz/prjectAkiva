import { IInstitutionGeneralData } from './../../interfaces/institution-general-data.interface';
import { Action } from 'redux';
import { IInstitution } from './../../interfaces/institution.interface';
import * as InstitutionActions from './institution.actions';
import { SharedReducer } from '../shared-reducer/shared.reducer';

const initialState: IInstitution = null;

export const InstitutionReducer = function (
  state: IInstitution = initialState,
  action: Action
): IInstitution {
  let institution;
  switch (action.type) {
    case InstitutionActions.SET_INSTITUTION:
      institution = (<InstitutionActions.SetInstitutionAction>action)
        .institution;
      return institution;
    default:
      if ((<any>action).objType && (<any>action).objType === 'institution') {
        state = SharedReducer(state, action);
      }
      return state;
  }
};
