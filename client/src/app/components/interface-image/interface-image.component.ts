import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-interface-image',
  templateUrl: './interface-image.component.html',
  styleUrls: ['./interface-image.component.scss']
})
export class InterfaceImageComponent implements OnInit {

  @Input() src: string;
  @Input() title: string;

  constructor() { }

  ngOnInit(): void {
  }

}
