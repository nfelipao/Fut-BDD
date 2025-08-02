import { Inject, Injectable } from '@nestjs/common';
import { IPlayerRepository } from './interfaces/player-repository.interface';
import { Player } from './entities/player.entity';


@Injectable()
export class PlayersService {
  constructor(
    @Inject('IPlayerRepository')
    private readonly playerRepository: IPlayerRepository,
  ) {}

  getPlayerById(id: number): Promise<Player | undefined> {
    return this.playerRepository.findOneById(id);
  }

  getPlayers(params: {
    page: number;
    size: number;
    club?: string;
    position?: string;
  }): Promise<{ players: Player[]; total: number }> {
    return this.playerRepository.findAllWithFilters(params);
  }
  
  async getAllClubs(): Promise<string[]> {
    return this.playerRepository.getAllClubs();
  }

  async getAllPositions(): Promise<string[]> {
    return this.playerRepository.getAllPositions();
  }

}
