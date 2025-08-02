import { Player } from '../../entities/player.entity';
import { IPlayerRepository } from '../../interfaces/player-repository.interface';



export class InMemoryPlayerRepository implements IPlayerRepository {
  private players: Player[] = [];


  
  async findAll(): Promise<Player[]> {
    return Promise.resolve([...this.players]);
  }

  async findOneById(id: number): Promise<Player | undefined> {
    return Promise.resolve(this.players.find((p) => p.id === id));
  }  
  

  async getAllClubs(): Promise<string[]> {
  return Array.from(new Set(this.players.map(p => p.club)));
}

async getAllPositions(): Promise<string[]> {
  return Array.from(new Set(this.players.map(p => p.position)));
}


  async findAllWithFilters(params: {
  page: number;
  size: number;
  club?: string;
  position?: string;
}): Promise<{ players: Player[]; total: number }> {
  const { page, size, club, position } = params;

  let filtered = [...this.players];

  if (club) {
    filtered = filtered.filter((p) =>
      p.club.toLowerCase().includes(club.toLowerCase()),
    );
  }

  if (position) {
    filtered = filtered.filter((p) =>
      p.position.toLowerCase().includes(position.toLowerCase()),
    );
  }

  const total = filtered.length;

  const start = (page - 1) * size;
  const end = start + size;
  const paginated = filtered.slice(start, end);

  return {
    players: paginated,
    total,
  };
}

}
