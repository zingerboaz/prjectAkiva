import { FormControl } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss']
})
export class CustomInputComponent implements OnInit {
  @Input() label:string;
  @Input() placeHolder:string;
  @Input() control: FormControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

  onChange(event){     
  }

}
