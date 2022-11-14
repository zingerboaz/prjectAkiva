import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'בני עקיבא';
  ngOnInit(){
      console.log('app componant init');
      
  }
}
