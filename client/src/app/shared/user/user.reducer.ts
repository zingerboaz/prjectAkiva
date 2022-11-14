import { Action } from 'redux';
import { IUser } from '../shared';
import { SharedReducer } from '../shared-reducer/shared.reducer';
import * as UserActions from './user.actions';


const initialState: IUser = null;

export const UserReducer = function (
  state: IUser = initialState,
  action: Action
): IUser {
  let user;
  switch (action.type) {
    case UserActions.SET_USER:
      user = (<UserActions.SetUserAction>action).user;
      return user;
    case UserActions.CHANGE_USER_PROPS:
      user = (<UserActions.SetUserAction>action).user;
      return Object.assign({}, state, user);
    default:
      if ((<any>action).objType && (<any>action).objType === 'users') {
        state = SharedReducer(state, action);
      }
      return state;
  }
};
