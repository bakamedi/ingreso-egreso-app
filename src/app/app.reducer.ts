import { ActionReducerMap } from '@ngrx/store';

import * as fromUI from './shared/ui.reducers';

export interface AppState {
  ui: fromUI.State;
}

export const appReducers: ActionReducerMap<AppState> = {
  ui: fromUI.uiReducer
};
