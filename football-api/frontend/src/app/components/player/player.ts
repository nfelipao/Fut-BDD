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
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortedPlayers: Player[] = [];
  searchName: string = '';

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
      next: (data) => this.clubs = data.sort((a, b) => a.localeCompare(b)),
    });

    this.playerService.getPositions().subscribe({
      next: (data) => this.positions = data.sort((a, b) => a.localeCompare(b)),
    });
  }

  getPlayers() {
    this.playerService
      .getPlayers(this.searchName, this.selectedClub, this.selectedPosition, this.page, this.size)
      .subscribe({
        next: (res) => {
          this.players = res.data;
          this.total = res.total;
          this.sortPlayers();
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

  setSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortPlayers();
  }

  sortPlayers() {
    this.sortedPlayers = [...this.players];
    if (this.sortColumn) {
      this.sortedPlayers.sort((a, b) => {
        const valueA = a[this.sortColumn as keyof Player];
        const valueB = b[this.sortColumn as keyof Player];

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return this.sortDirection === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        }

        return 0;
      });
    }
  }
}
