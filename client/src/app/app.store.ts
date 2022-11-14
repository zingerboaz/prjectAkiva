import { BehaviorSubject } from 'rxjs';
import { InjectionToken } from '@angular/core';
import {
  createStore,
  compose,
  StoreEnhancer,
  applyMiddleware,
} from 'redux';
import { AppState, default as reducer } from './app.reducer';
import logger from 'redux-logger';
import { loadState, saveState } from './shared/localStorage';
export const AppStore = new InjectionToken('App.store');

const devtools: StoreEnhancer<AppState> = window['devToolsExtension']
  ? window['devToolsExtension']()
  : (f) => f;

export function createAppStore() {
  const persistedState = loadState();
  const store = createStore(reducer, persistedState, composeEnhancers(applyMiddleware(logger),));
  store.state = new BehaviorSubject(store.getState())
  store.subscribe(() => {
    saveState(store.getState())
    store.state.next(store.getState())
  })

  return store;
}

export const appStoreProviders = [
  { provide: AppStore, useFactory: createAppStore },
];
const composeEnhancers =
  (typeof window !== 'undefined' &&
    window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']) ||
  compose;
