import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appNoDataClass]'
})
export class NoDataClassDirective implements OnInit{
  @Input()data: any;
  @Input() dataClass: string;
  @Input() noDataClass: string = 'no-data';

  constructor(
      private renderer: Renderer2,
      private elementRef: ElementRef)
  { }
  
  ngOnInit() {
    this.setDisplayDataClass()
  }
  
  setDisplayDataClass(){
    if (this.data) {
      this.renderer.addClass(this.elementRef.nativeElement, this.dataClass);
    } else {
      this.renderer.addClass(this.elementRef.nativeElement, this.noDataClass)
    }
  }

}
