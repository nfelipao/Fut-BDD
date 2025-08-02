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

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    console.log('PlayerComponent initialized');
    this.playerService.getPlayer(1).subscribe({
      next: (data) => (this.player = data),
      error: (err) => (this.errorMessage = 'Jugador no encontrado'),
    });
  }
}
