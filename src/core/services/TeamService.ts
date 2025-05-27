import { Team } from '../models/incentivePlanTypes';

export interface TeamService {
  getTeams(): Promise<{ succeeded: boolean, message: string, data: Team[] }>;
  getTeamById(id: string): Promise<{ succeeded: boolean, message: string, data: Team }>;
}
