import { Action } from '@ngrx/store';
import { User } from './user.model';
import { UnSetItemsAction } from '../ingreso-egreso/ingreso-egreso.actions';



export const SET_USER = '[Auth] Set User';
export const UNSET_USER = '[Auth] Unset User';

export class SetUserAction implements Action {
  readonly type = SET_USER;

  constructor( public user: User) {}
}

export class UnSetUserAction implements Action {
  readonly type = UNSET_USER;
}

export type actionsAuth = SetUserAction | UnSetUserAction;
