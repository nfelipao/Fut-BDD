import { Player } from '../entities/player.entity';

export interface IPlayerRepository {
  findAll(): Promise<Player[]>;
  findOneById(id: number): Promise<Player | undefined>;

  findAllWithFilters(params: {
    page: number;
    size: number;
    club?: string;
    position?: string;
  }): Promise<{ players: Player[]; total: number }>;

getAllClubs(): Promise<string[]>;
getAllPositions(): Promise<string[]>;

  
  
}
