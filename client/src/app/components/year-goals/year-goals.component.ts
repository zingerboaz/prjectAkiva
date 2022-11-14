import { ActivatedRoute } from '@angular/router';
import { IYearGoals } from './../../interfaces/yearGoal.interface';
import { Component, OnInit } from '@angular/core';
import { GOALS_DESCRTIPTIONS } from './goals-descriptions';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { YearGoalsDialogComponent } from '../year-goals-dialog/year-goals-dialog.component';

@Component({
  selector: 'app-year-goals',
  templateUrl: './year-goals.component.html',
  styleUrls: ['./year-goals.component.scss'],
})
export class YearGoalsComponent implements OnInit {
  yearGoals: IYearGoals;
  goalsKeys: string[];
  goalsDiscriptions = GOALS_DESCRTIPTIONS;

  imageData = [{
    'title': 'זהות',
    'name': 'identity',
    'src': '../../assets/images/zeout.png',
    'style':  {'background-color' : '#58ACDC', 'border-radius': '20px', 'margin': '5px 30px', 'padding': '0px',
    'box-shadow':' 5px 0px #58ACDC', 'border':'none'
  }
  },
  {
    'title': 'שליחות',
    'name': 'mission',
    'src': '../../assets/images/shlihout.png',
    'style':  {'background-color' : '#ABC03F', 'border-radius': '20px', 'margin': '5px 30px', 'padding': '0px',
    'box-shadow':' 5px 0px #ABC03F', 'border':'none'

   }
  },
  {
    'title': 'מצוינות',
    'name': 'excellence',
    'src': '../../assets/images/metsouyanout.png',
    'style': {'background-color' : '#F2C94C', 'border-radius': '20px', 'margin': '5px 30px', 'padding': '0px',
    'box-shadow':' 5px 0px #F2C94C','border':'none'
  }
  },
]

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.setYearGoals()
  }

  setYearGoals(){
    this.activatedRoute.data.subscribe(data => {
      this.yearGoals = data["yearGoals"];
      this.goalsKeys = Object.keys(this.yearGoals)
    })
  }

  openDialog(title:string) {
    const dialogConfig = new MatDialogConfig();
     if (title === 'זהות') {
      dialogConfig.data = this.yearGoals["identity"];
    }
    else if (title === 'שליחות') {
      dialogConfig.data = this.yearGoals["mission"];
    }
    else if (title === 'מצוינות') {
      dialogConfig.data = this.yearGoals["excellence"];
    }
    const dialogRef = this.dialog.open(YearGoalsDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
