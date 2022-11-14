import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-custom-input-multiple',
  templateUrl: './custom-input-multiple.component.html',
  styleUrls: ['./custom-input-multiple.component.scss']
})
export class CustomInputMultipleComponent implements OnInit {
  @Input() label:string;
  @Input() input_details:any;
  @Input() formControls: FormGroup;
  @Input() is_editable_institution:boolean = false;
  changed: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  onChange(event){
    this.formControls.parent.value.is_enable = true;
  }
}
