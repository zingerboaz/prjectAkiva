import { InstitutionService } from './../../services/institution.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { IYearGoal, IYearGoals } from './../../interfaces/yearGoal.interface';
import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GOALS_DESCRTIPTIONS } from '../year-goals/goals-descriptions';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { YearGoalsDialogComponent } from '../year-goals-dialog/year-goals-dialog.component';
import { InstituionYearGoalDialogComponent } from '../instituion-year-goal-dialog/instituion-year-goal-dialog.component';

@Component({
    selector: 'app-institution-year-goals',
    templateUrl: './institution-year-goals.component.html',
    styleUrls: ['./institution-year-goals.component.scss'],
    animations: [trigger('openAndClose', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('0.8s ease-out',
                style({ opacity: 1 }))
        ]),
        transition(':leave', [
            style({ opacity: 1 }),
            animate('0.5s ease-in',
                style({ opacity: 0 }))
        ])
    ])]
})
export class InstitutionYearGoalsComponent implements OnInit {
    formGroup: FormGroup;
    yearGoals: IYearGoals;
    goalsKeys: string[];
    openedExpansion: string = null;
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
        'box-shadow':' 5px 0px #F2C94C', 'border':'none'
    }
      },
    ]


    constructor(private activatedRoute: ActivatedRoute,
        private institutionService: InstitutionService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar) { }

    ngOnInit() {
        this.setYearGoals()
        // console.log(this.getMilestoneDateControl('EXCELLENCE', 0, 0).value)
    }

    setYearGoals() {
        this.activatedRoute.data.subscribe(data => {
            this.yearGoals = data["yearGoals"];
            this.goalsKeys = Object.keys(this.yearGoals);
            console.log('goal keys', this.goalsKeys);

            this.initFormGroup();
        })
    }

    initFormGroup() {
        this.formGroup = new FormGroup({});
        this.goalsKeys.forEach(item => {
            this.formGroup.addControl(item, this.getScopeFormGroup(this.yearGoals[item]))
        })

    }

    getScopeFormGroup(scope: IYearGoal): FormGroup {
        const editExpirationDateStr = scope.edit_expiration;
        let subGroup: FormGroup = new FormGroup({
            year: new FormControl({value: scope.year, disabled: true}),
            description: new FormControl({ value: scope.description, disabled: this.verifyIfDisabled(editExpirationDateStr) }, [Validators.required]),
            reason: new FormControl({value: scope.reason, disabled: this.verifyIfDisabled(editExpirationDateStr)}, [Validators.required]),
            description2: new FormControl({ value: scope.description2, disabled: this.verifyIfDisabled(editExpirationDateStr) }, [Validators.required]),
            reason2: new FormControl({value: scope.reason2, disabled: this.verifyIfDisabled(editExpirationDateStr)}, [Validators.required]),
            action_ways: new FormArray([]),
            id: new FormControl({value: scope.id, disabled: true})
        })
        scope.action_ways.forEach(actionWay => {
            (<FormArray>subGroup.controls["action_ways"]).push(new FormGroup({
                id: new FormControl({value: actionWay.id, disabled: true}),
                goal: new FormControl({value: actionWay.goal, disabled: true}),
                direction: new FormControl({value: actionWay.direction, disabled: this.verifyIfDisabled(editExpirationDateStr)}, [Validators.required]),
                success_indice: new FormControl({value: actionWay.success_indice, disabled: this.verifyIfDisabled(editExpirationDateStr)},
                    [Validators.required]),
                milestones: new FormArray([])
            }))
            actionWay.milestones.forEach(mileStone => {
                (<FormArray>subGroup.controls["action_ways"]).controls.forEach((actionWayFormGroup: FormGroup) => {
                    (<FormArray>actionWayFormGroup.controls["milestones"]).push(new FormGroup({
                        id: new FormControl({value: mileStone.id, disabled: true}),
                        action_way: new FormControl({value: mileStone.action_way, disabled: true}),
                        description: new FormControl(
                            {value:mileStone.description, disabled: this.verifyIfDisabled(editExpirationDateStr)},
                            [Validators.required]),
                        date: new FormControl({value:mileStone.date, disabled: this.verifyIfDisabled(editExpirationDateStr)}, [Validators.required])
                    }))
                });
            })
        });
        return subGroup;
    }

    onExpansionClicked(name) {
        this.openedExpansion === name
            ? (this.openedExpansion = null)
            : (this.openedExpansion = name);

    }

    getScopeDescriptionControl(scopeGroupName: string): FormControl {
        return <FormControl>(<FormGroup>this.formGroup
            .controls[scopeGroupName])
            .controls["description"]
    }

    getScopeReasonControl(scopeGroupName: string): FormControl {
        return <FormControl>(<FormGroup>this.formGroup
            .controls[scopeGroupName])
            .controls["reason"]
    }

    getScopeDescription2Control(scopeGroupName: string): FormControl {
        return <FormControl>(<FormGroup>this.formGroup
            .controls[scopeGroupName])
            .controls["description2"]
    }

    getScopeReason2Control(scopeGroupName: string): FormControl {
        return <FormControl>(<FormGroup>this.formGroup
            .controls[scopeGroupName])
            .controls["reason2"]
    }

    getActionDirectionControl(scopeGroupName: string, actionIndex: number): FormControl {
        return <FormControl>(<FormGroup>(<FormArray>(<FormGroup>this.formGroup
            .controls[scopeGroupName])
            .controls["action_ways"])
            .controls[actionIndex])
            .controls["direction"]
    }

    getActionSuccessIndicesControl(scopeGroupName: string, actionIndex: number): FormControl {
        return <FormControl>(<FormGroup>(<FormArray>(<FormGroup>this.formGroup
            .controls[scopeGroupName])
            .controls["action_ways"])
            .controls[actionIndex])
            .controls["success_indice"]

    }

    getMilestoneDateControl(scopeGroupName: string, actionIndex: number, mileStoneIndex: number): FormControl {
        return <FormControl>(<FormGroup>(<FormArray>(<FormGroup>(<FormArray>(<FormGroup>this.formGroup
            .controls[scopeGroupName])
            .controls["action_ways"])
            .controls[actionIndex])
            .controls["milestones"])
            .controls[mileStoneIndex])
            .controls["date"]
    }

    getMilestoneDescriptionControl(scopeGroupName: string, actionIndex: number, mileStoneIndex: number): FormControl {
        return <FormControl>(<FormGroup>(<FormArray>(<FormGroup>(<FormArray>(<FormGroup>this.formGroup
            .controls[scopeGroupName])
            .controls["action_ways"])
            .controls[actionIndex])
            .controls["milestones"])
            .controls[mileStoneIndex])
            .controls["description"]
    }

    onAddMilestone(scopeGroupName: string, actionIndex: number) {
        let actionId: number = (<FormGroup>(<FormArray>(<FormGroup>this.formGroup
            .controls[scopeGroupName])
            .controls["action_ways"])
            .controls[actionIndex]).getRawValue()["id"];


        (<FormArray>(<FormGroup>(<FormArray>(<FormGroup>this.formGroup
            .controls[scopeGroupName])
            .controls["action_ways"])
            .controls[actionIndex])
            .controls["milestones"]).push(new FormGroup({
                action_way: new FormControl({value: actionId, disabled: true}),
                description: new FormControl(undefined, [Validators.required]),
                date: new FormControl(undefined, [Validators.required])
            }))

        this.yearGoals[scopeGroupName].action_ways[actionIndex].milestones.push({
            id: undefined,
            description: undefined,
            date: undefined,
            action_way: undefined
        });


    }

    onSave() {
        console.log(this.formGroup.getRawValue())
        this.institutionService.updateYearGoals(this.formGroup.getRawValue()).subscribe(response => {
            if(response){
                this.snackBar.open('הנתונים עודכנו בהצלחה', '', {
                    duration: 3000,
                });
            }
        })

    }


    verifyIfDisabled (editExpirationDateString: string): boolean {
        const editExpirationUnixDate = new Date(editExpirationDateString).getTime();
        return editExpirationUnixDate ? editExpirationUnixDate <= Date.now() : false;
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
    const dialogRef = this.dialog.open(InstituionYearGoalDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
