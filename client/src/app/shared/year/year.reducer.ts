import {Action} from 'redux';
import * as YearActions from './year.actions';
import {SharedReducer} from '../shared-reducer/shared.reducer';
import {IYear} from '../../interfaces/year.interface';

const initialState: IYear = null;

export const YearReducer = function (state: IYear = initialState, action: Action): IYear {
    console.log('Reducer Action', action);
    let year;
    
    switch (action.type) {
        case YearActions.SET_YEAR:
            year = (<YearActions.SetYearAction>action).year;
            return year;
        default:
            if ((<any>action).objType && (<any>action).objType === 'year') {
                state = SharedReducer(state, action);
            }
            return state;
    }
};
