import { ActionReducerMap } from '@ngrx/store';

import * as fromUI from './shared/ui.reducers';
import * as fromAuth from './auth/auth.reducers';
// import * as fromIngresoEgreso from './ingreso-egreso/ingreso-egreso.reducers';

export interface AppState {
  ui: fromUI.State;
  auth: fromAuth.AuthState;
  // ingresoEgreso: fromIngresoEgreso.IngresoEgresoState;
}

export const appReducers: ActionReducerMap<AppState> = {
  ui: fromUI.uiReducer,
  auth: fromAuth.authReducer,
  // ingresoEgreso: fromIngresoEgreso.IngresoEgresoReducer
};
