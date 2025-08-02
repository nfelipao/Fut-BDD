import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayerDto } from './dto/player.dto';

import { Query } from '@nestjs/common';

@Controller('api/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}


  @Get()
  @HttpCode(HttpStatus.OK)
  async getPlayers(
    @Query('page') page = 1,
    @Query('size') size = 20,
    @Query('club') club?: string,
    @Query('position') position?: string,
  ): Promise <{data: PlayerDto[], total: number; page: number; size: number}> {
    const pageNumber = Number(page) || 1;
    const pageSize = Number(size) || 20;

    const {players, total} = await this.playersService.getPlayers({
      page: pageNumber,
      size: pageSize,
      club,
      position,
    });

    return {
      data: players.map(player => new PlayerDto(player)),
      total,
      page: pageNumber,
      size: pageSize,
    };
}

  @Get('clubs')
  async getClubs(): Promise<string[]> {
    return this.playersService.getAllClubs();
}
  @Get('positions')
  async getPositions(): Promise<string[]> {
    return this.playersService.getAllPositions();
  }


  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPlayerById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlayerDto | undefined> {
    const player = await this.playersService.getPlayerById(id);
    console.log(`Fetching player  ${player}`);
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found.`);
    }

    return new PlayerDto(player);
  }

}
