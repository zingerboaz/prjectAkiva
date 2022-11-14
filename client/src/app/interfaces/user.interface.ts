import { IInstitution } from './institution.interface';
import { IRole } from './role';
export interface IUser {
  user: {
    id: number;    
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    is_change_password_required: boolean;    
    image_profile: string;
    role: IRole;   
  },
  institutions_list?: IInstitution [];
  institution?: IInstitution;
}

