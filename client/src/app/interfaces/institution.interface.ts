import { IManager } from './manager';
export interface IInstitution {
  id: number;
  name: string;
  semel: string;
  logo_url: string;
  background_url: string;
  manager: IManager,
  area_manager: IManager,
  last_updated_year?: string
  inspector: string,
  is_boarding: boolean
  full_ownership: boolean
}
