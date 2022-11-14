import { FormControl } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

@Component({
    selector: 'app-calander-input',
    templateUrl: './calander-input.component.html',
    styleUrls: ['./calander-input.component.scss']
})
export class CalanderInputComponent implements OnInit {
    @Input() label: string = 'תאריך'
    @Input() placeHolder: string = 'DD/MM/YYYY'
    @Input() control: FormControl = new FormControl();
    localControl: FormControl = new FormControl();

    constructor() { }

    ngOnInit() {
        let splitedDateString = this.control.value?.split('/');
        if (this.control.disabled) {
            this.localControl.disable();
        }
        if (splitedDateString) {
            let year = +splitedDateString[2];
            let month = +splitedDateString[1] - 1;
            let day = +splitedDateString[0];
            this.localControl.setValue(new Date(Date.UTC(year, month, day)));
            
            
        }
        this.localControl.valueChanges.subscribe(value => {
            this.control.setValue(formatDate(value, 'dd/MM/yyyy', 'en-GB'));
            
        })
    }
}
