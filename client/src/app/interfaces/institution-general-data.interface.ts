import { IInstitution } from './institution.interface';
import { IYear } from './year.interface';

export interface IInstitutionGeneralData {
    id: number;
    num_of_student: number;
    num_of_class: number;
    num_of_special_class: number;
    num_of_teacher: number;
    student_integration: string;
    institution_strength: string;
    institution_story: string;
    institution_challenge: string;
    institution: IInstitution;
    year: IYear;
    programs:[
      {
        title: string,
        id: number,
        name: string,
        purpose: string,
        target_audience: string,
        regularity: string,
        success_factors: string,
        program_type: string
      },
      {
        title: string,
        id: number,
        name: string,
        purpose: string,
        target_audience: string,
        regularity: string,
        success_factors: string,
        program_type: string
      },
      {
          title: string,
          id: number,
          name: string,
          purpose: string,
          target_audience: string,
          regularity: string,
          success_factors: string,
          program_type: string
        }
    ]
    name_of_program: string;
    goal_of_program: string;
    target_audience: string;
    regularity: string;
    success_factors: string;
    name_of_program_2: string;
    goal_of_program_2: string;
    target_audience_2: string;
    regularity_2: string;
    success_factors_2: string;
    name_of_program_3: string;
    goal_of_program_3: string;
    target_audience_3: string;
    regularity_3: string;
    success_factors_3: string;
}

export interface IUpdateGeneralInfo {
    institution_id: number,
    year: string,
    strength: string;
    story: string;
    name_of_program: string;
    goal_of_program: string;
    target_audience: string;
    regularity: string;
    success_factors: string;
}

export interface IIUpdateGeneralInfoResponse {
    message: string,
    data: IInstitutionGeneralData
}
