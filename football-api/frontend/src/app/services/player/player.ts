import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Player {
  id: number;
  playerFaceUrl: string;
  name: string;
  club: string;
  position: string;
  nationality: string;
  rating: number;
  speed: number;
  shooting: number;
  dribbling: number;
  passing: number;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private baseUrl = 'http://localhost:3000/api/players';

  constructor(private http: HttpClient) { }

  getPlayer(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.baseUrl}/${id}`);
  }

  getPlayers(
    name?: string,
    club?: string,
    position?: string,
    page: number = 1,
    size: number = 10
  ): Observable<{ data: Player[]; total: number }> {
    const params: any = {
      ...(name && { name }),
      ...(club && { club }),
      ...(position && { position }),
      page,
      size,
    };

    return this.http.get<{ data: Player[]; total: number }>(this.baseUrl, { params });
  }

  getClubs(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/clubs`);
  }

  getPositions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/positions`);
  }

}
