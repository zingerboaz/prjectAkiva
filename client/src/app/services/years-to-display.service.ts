import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
    providedIn: "root"
})
export class YearsToDisplayService {
    private availableYearsSubject = new BehaviorSubject([]);
    private $availableYears = this.availableYearsSubject.asObservable();
    
    setAvailableYears(availableYears: any[]) {
        console.log('availableYears', availableYears);
        this.availableYearsSubject.next(availableYears.slice());
    }
    
    getAvailableYears(): Observable<any[]> {
        return this.$availableYears;
    }
    
}
