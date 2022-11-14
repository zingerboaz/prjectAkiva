import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {

  public progressBarOn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  on(){
    this.progressBarOn$.next(true)
  }

  off(){
    this.progressBarOn$.next(false)
  }

  constructor() {}

}
