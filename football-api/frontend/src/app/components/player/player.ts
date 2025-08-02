import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player/player';
import { Player } from '../../services/player/player';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [PlayerService],
  templateUrl: './player.html',
  styleUrls: ['./player.css'],
})
export class PlayerComponent implements OnInit {
  player?: Player;
  errorMessage = '';

  players: Player[] = [];
  clubs: string[] = [];
  positions: string[] = [];
  selectedClub: string = '';
  selectedPosition: string = '';
  page = 1;
  size = 10;
  total = 0;

  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    console.log('PlayerComponent initialized');
    this.playerService.getPlayer(1).subscribe({
      next: (data) => (this.player = data),
      error: (err) => (this.errorMessage = 'Jugador no encontrado'),
    });


    this.getFilterOptions();
    this.getPlayers();


  }
  getFilterOptions() {
    this.playerService.getClubs().subscribe({
      next: (data) => this.clubs = data,
    });

    this.playerService.getPositions().subscribe({
      next: (data) => this.positions = data,
    });
  }

  getPlayers() {
    this.playerService
      .getPlayers('', this.selectedClub, this.selectedPosition, this.page, this.size)
      .subscribe({
        next: (res) => {
          this.players = res.data;
          this.total = res.total;
        },
        error: () => {
          this.players = [];
          this.total = 0;
        }
      });
  }

  onFilterChange() {
    this.page = 1;
    this.getPlayers();
  }

  nextPage() {
    if (this.page * this.size < this.total) {
      this.page++;
      this.getPlayers();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.getPlayers();
    }
  }
}
