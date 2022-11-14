import {BehaviorSubject} from 'rxjs';
import { AppState } from './app.reducer';

declare module 'redux' {
 export interface Store {
   state: BehaviorSubject<AppState>

 }
}
