import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PlayerModel } from './player.model'; // Sequelize model
import { IPlayerRepository } from '../../interfaces/player-repository.interface';
import { Player } from '../../entities/player.entity';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';


@Injectable()
export class SequelizePlayerRepository implements IPlayerRepository {
  constructor(
    @InjectModel(PlayerModel)
    private readonly playerModel: typeof PlayerModel,
  ) {}

  async findAll(): Promise<Player[]> {
    const playerList = await this.playerModel.findAll();
    return playerList.map((x) => this.mapToEntity(x));
  }

  async findOneById(id: number): Promise<Player | undefined> {
    const model = await this.playerModel.findByPk(id);
    if (!model) {
      return undefined;
    }
    return this.mapToEntity(model);
  }



  async getAllClubs(): Promise<string[]> {
  const clubs = await this.playerModel.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('club_name')), 'club_name'],
    ],
    raw: true,
  });

  return clubs.map((c: any) => c.club_name).filter(Boolean);
}

async getAllPositions(): Promise<string[]> {
  const positions = await this.playerModel.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('player_positions')), 'player_positions'],
    ],
    raw: true,
  });

  const rawPositions = positions.map((p: any) => p.player_positions);
  const uniquePositions = new Set<string>();

  rawPositions.forEach((pos) => {
    if (pos) {
      pos.split(',').forEach((p: string) => uniquePositions.add(p.trim()));
    }
  });

  return Array.from(uniquePositions);
}




  async findAllWithFilters(params:{
    page: number;
    size: number;
    club?: string;
    position?: string;
  }): Promise<{ players: Player[]; total: number }> {
    const { page, size, club, position } = params;
    const offset = (page - 1) * size;
    const limit = size;

    const where: any = {};
    if (club) {
      where.clubName = club;
    }
    if (position) {
      where.playerPositions = { [Op.like]: `%${position}%` };
    }

    const { rows, count } = await this.playerModel.findAndCountAll({
      where,
      offset,
      limit,
    });

    const players = rows.map((x) => this.mapToEntity(x));
    return { players, total: count };
  }

  private mapToEntity(model: PlayerModel): Player {
    console.log('Mapping PlayerModel to Player entity:', model);
    if (!model) {
      throw new Error('Attempted to map null model to Player entity');
    }
    const player = new Player();
    player.id = model.id;
    player.playerFaceUrl = model.playerFaceUrl;
    player.name = model.longName;
    player.club = model.clubName || 'Unknown Club';
    player.position = model.playerPositions?.split(',')[0].trim() ?? 'Unknown';
    player.nationality = model.nationalityName || 'Unknown Nationality';
    player.rating = model.overall;
    player.speed = model.pace ?? 0;
    player.shooting = model.shooting ?? 0;
    player.dribbling = model.dribbling ?? 0;
    player.passing = model.passing ?? 0;

    return player;
  }

  
}
