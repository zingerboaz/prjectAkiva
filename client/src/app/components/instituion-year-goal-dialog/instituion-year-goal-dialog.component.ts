import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IYearGoal, IYearGoals } from 'src/app/interfaces/yearGoal.interface';
import { InstitutionService } from 'src/app/services/institution.service';

@Component({
  selector: 'app-instituion-year-goal-dialog',
  templateUrl: './instituion-year-goal-dialog.component.html',
  styleUrls: ['./instituion-year-goal-dialog.component.scss']
})
export class InstituionYearGoalDialogComponent  {
  formGroup: FormGroup;
  yearGoals: any;
  goalsKeys: string[];
  data: any;


  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private institutionService: InstitutionService,
    private snackBar: MatSnackBar) {
    this.data = data
}

ngAfterViewInit(): void{
  this.setYearGoals()
}

setYearGoals() {
  this.yearGoals = this.data;
  console.log('year goal', this.yearGoals);
  this.initFormGroup();
}

initFormGroup() {
  this.formGroup = new FormGroup({});
      this.formGroup.addControl(this.yearGoals.scope.toLowerCase(), this.getScopeFormGroup(this.yearGoals))
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
              if (actionWayFormGroup.controls["id"].value == mileStone.action_way){
                (<FormArray>actionWayFormGroup.controls["milestones"]).push(new FormGroup({
                    id: new FormControl({value: mileStone.id, disabled: false}),
                    action_way: new FormControl({value: mileStone.action_way, disabled: true}),
                    description: new FormControl(
                        {value:mileStone.description, disabled: this.verifyIfDisabled(editExpirationDateStr)},
                        [Validators.required]),
                    date: new FormControl({value:mileStone.date, disabled: this.verifyIfDisabled(editExpirationDateStr)}, [Validators.required])
                }))
              };
          });
      })
  });
  return subGroup;
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


   let id : number = (<FormArray>(<FormGroup>(<FormArray>(<FormGroup>this.formGroup
      .controls[scopeGroupName])
      .controls["action_ways"])
      .controls[actionIndex])
      .controls["milestones"]).value[(<FormArray>(<FormGroup>(<FormArray>(<FormGroup>this.formGroup
      .controls[scopeGroupName])
      .controls["action_ways"])
      .controls[actionIndex])
      .controls["milestones"]).value.length - 1].id + 1;
  (<FormArray>(<FormGroup>(<FormArray>(<FormGroup>this.formGroup
      .controls[scopeGroupName])
      .controls["action_ways"])
      .controls[actionIndex])
      .controls["milestones"]).push(new FormGroup({
          id: new FormControl({value: id, disabled: true}),
          action_way: new FormControl({value: actionId, disabled: true}),
          description: new FormControl(undefined, [Validators.required]),
          date: new FormControl(undefined, [Validators.required])
      }))

  this.yearGoals.action_ways[actionIndex].milestones.push({
      id: undefined,
      description: undefined,
      date: undefined,
      action_way: undefined
  });


}

verifyIfDisabled (editExpirationDateString: string): boolean {
  const editExpirationUnixDate = new Date(editExpirationDateString).getTime();
  return editExpirationUnixDate ? editExpirationUnixDate <= Date.now() : false;
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
