import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-custom-select',
  templateUrl: './costum-select.component.html',
  styleUrls: ['./costum-select.component.scss']
})
export class CustomSelectComponent implements OnInit {
  @Input() label:string;
  @Input() placeHolder:string;
  @ViewChild('select') select : ElementRef;
  @Input() options: string[] = [
    'מצויינות','זהות','שליחות','בחר תחום'
  ].reverse()
  constructor() { }

  ngOnInit() {

  }


}
