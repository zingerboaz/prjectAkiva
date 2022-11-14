import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';



@Component({
  selector: 'app-year-goals-dialog',
  templateUrl: './year-goals-dialog.component.html',
  styleUrls: ['./year-goals-dialog.component.scss']
})
export class YearGoalsDialogComponent implements OnInit {
  yearGoals: any;
  goalsKeys: any;
  data:any;
  boxShadow = '10px 5px yellow'

  constructor(
      @Inject(MAT_DIALOG_DATA) data) { 
      this.data = data
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void{
    this.setYearGoals()
}

  setYearGoals(){
    this.yearGoals = this.data;
    console.log('year goal', this.yearGoals);
    console.log('golas keys', this.goalsKeys);
    
  }

  getBoxShadowColor(goal: string){
    console.log('goal', goal);
    switch (goal) {
      case 'mission':
        return '5px 6px  0px rgba(171, 192, 63, 1)'
      case 'identity':
        return '5px 6px  0px rgba(88, 172, 220, 1)'
      case 'excellence':
        return '5px 6px  0px rgba(242, 201, 76, 1)'
    }
  }

  getBackgroundColor(goal: string){
    console.log('goal', goal);
    switch (goal) {
      case 'mission':
        return '#ABC03F';
      case 'identity':
        return '#58ACDC';
      case 'excellence':
        return '#F2C94C';
    }
  }
}
