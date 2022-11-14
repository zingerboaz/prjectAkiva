export interface IYearGoal {
  scope: string,
  scopeName?: string,
  id: number,
  description: string,
  reason: string,
  description2: string,
  reason2: string,
  year: number,
  institution: number,
  edit_expiration: string,
  action_ways: {
    id: number,
    direction: string,
    success_indice: string,
    goal: number,
    milestones: {
      id: number,
      description: string,
      date: string,
      action_way: number
    }[]
  }[],

}

export interface IYearGoals{
    excellence?: IYearGoal,
    identity?: IYearGoal,
    mission?: IYearGoal

}
