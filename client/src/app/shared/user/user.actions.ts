import { Action, ActionCreator } from 'redux';
import { IUser } from 'src/app/interfaces/user.interface';

export const SET_USER = '[User] set';
export interface SetUserAction extends Action {
  user: IUser;
}
export const setUser: ActionCreator<SetUserAction> = (user) => ({
  type: SET_USER,
  user: user ? user : user,
});

export const CHANGE_USER_PROPS = '[User] change props';
export interface ChangeUserPropsAction extends Action {
  user: Partial<IUser>;
}
export const changeUserProps: ActionCreator<ChangeUserPropsAction> = (
  user
) => ({
  type: CHANGE_USER_PROPS,
  user: user.user,
});
