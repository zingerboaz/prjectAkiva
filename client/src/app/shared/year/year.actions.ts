import { IYear } from './../../interfaces/year.interface';
import { Action, ActionCreator } from 'redux';

export const SET_YEAR = '[Year] set';

export interface SetYearAction extends Action {
  year: IYear;
}

export const setYear: ActionCreator<SetYearAction> = (year) => ({
  type: SET_YEAR,
  year: year,
});
