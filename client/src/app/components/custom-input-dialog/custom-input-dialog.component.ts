import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input-dialog',
  templateUrl: './custom-input-dialog.component.html',
  styleUrls: ['./custom-input-dialog.component.scss']
})
export class CustomInputDialogComponent implements OnInit {
  @Input() label:string;
  @Input() placeHolder:string;
  @Input() control: FormControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

  onChange(event){     
  }

}

