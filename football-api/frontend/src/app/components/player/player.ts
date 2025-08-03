import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player/player';
import { Player } from '../../services/player/player';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
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
  nationalityFlags: { [key: string]: string } = {
    'Argentina': '🇦🇷',
    'Brazil': '🇧🇷',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Spain': '🇪🇸',
    'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'Italy': '🇮🇹',
    'Netherlands': '🇳🇱',
    'Portugal': '🇵🇹',
    'Belgium': '🇧🇪',
    'Uruguay': '🇺🇾',
    'Chile': '🇨🇱',
    'Colombia': '🇨🇴',
    'Mexico': '🇲🇽',
    'United States': '🇺🇸 ',
    'Japan': '🇯🇵',
    'Korea Republic': '🇰🇷',
    'Australia': '🇦🇺',
    'China': '🇨🇳',
    'Russia': '🇷🇺',
    'Poland': '🇵🇱',
    'Sweden': '🇸🇪',
    'Norway': '🇳🇴',
    'Denmark': '🇩🇰',
    'Finland': '🇫🇮',
    'Greece': '🇬🇷',
    'Turkey': '🇹🇷',
    'Egypt': '🇪🇬',
    'Nigeria': '🇳🇬',
    'Wales':  '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    'Croatia': '🇭🇷 ',
    'Serbia': '🇷🇸',
    'Côte d\'Ivoire': '🇨🇮',
    'Senegal': '🇸🇳',
    'Cameroon': '🇨🇲',
    'Ghana': '🇬🇭',
    'South Africa': '🇿🇦',
    'Morocco': '🇲🇦',
    'Tunisia': '🇹🇳',
    'Algeria': '🇩🇿',
    'Ivory Coast': '🇨🇮',
    'Mali': '🇲🇱',
    'Angola': '🇦🇴',
    'Zambia': '🇿🇲',
    'Czech Republic': '🇨🇿',
    'Slovakia': '🇸🇰',
    'Hungary': '🇭🇺',
    'Austria': '🇦🇹',
    'Switzerland': '🇨🇭',
    'Romania': '🇷🇴',
    'Bulgaria': '🇧🇬',
    'Ukraine': '🇺🇦',
    'Belarus': '🇧🇾',
    'Lithuania': '🇱🇹',
    'Latvia': '🇱🇻',
    'Estonia': '🇪🇪',
    'Peru': '🇵🇪',
    'Ecuador': '🇪🇨',
    'Paraguay': '🇵🇾',
    'Bolivia': '🇧🇴',
    'Venezuela': '🇻🇪',
    'Costa Rica': '🇨🇷',
    'Panama': '🇵🇦',
    'Honduras': '🇭🇳',
    'Guatemala': '🇬🇹',
    'El Salvador': '🇸🇻',
    'Nicaragua': '🇳🇮',
    'Jamaica': '🇯🇲',
    'Trinidad and Tobago': '🇹🇹',
    'Barbados': '🇧🇧',
    'Bahamas': '🇧🇸',
    'Cuba': '🇨🇺',
    'Dominican Republic': '🇩🇴',
    'Puerto Rico': '🇵🇷',
    'Armenia': '🇦🇲',
    'Georgia': '🇬🇪',
    'Azerbaijan': '🇦🇿',
    'Slovenia': '🇸🇮',
    'Bosnia and Herzegovina': '🇧🇦',
    'Montenegro': '🇲🇪',
    'Togo': '🇹🇬',
    'Republic of Ireland': '🇮🇪',
    'Northern Ireland': '🏴󠁧󠁢󠁮󠁩󠁲󠁿',
    'Gabon': '🇬🇦',
    'Canada': '🇨🇦',
    'North Macedonia': '🇲🇰',
    'Congo': '🇨🇬',
    'Albania': '🇦🇱',
    'Benin': '🇧🇯',
    'Iceland': '🇮🇸',
    'Guinea': '🇬🇳',
    'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'Congo DR': '🇨🇩',
    'Saudi Arabia': '🇸🇦',
    'Israel': '🇮🇱',
    'Iran': '🇮🇷',
    'Iraq': '🇮🇶',
    'Luxembourg': '🇱🇺',
    'Philippines': '🇵🇭',
    'Khazakstan': '🇰🇿',
    'Kosovo': '🇽🇰',
    'Faroe Islands': '🇫🇴',
    'Uganda': '🇺🇬',
    'Sierra Leone': '🇸🇱',
    'Antigua and Barbuda': '🇦🇬',
    'Kenya': '🇰🇪',
    'Niger': '🇳🇪',
    'Comoros': '🇰🇲',
    'Central African Republic': '🇨🇫',
    'Gambia': '🇬🇲',
    'Zimbabwe': '🇿🇼',
    'Saint Lucia': '🇱🇨',
    'Suriname': '🇸🇷',
    'Curacao': '🇨🇼',
    'Liechtenstein': '🇱🇮',
    'Burundi': '🇧🇮',
    'Afghanistan': '🇦🇫',
    'Montserrat': '🇲🇸',
    'Eritrea': '🇪🇷',
    'Guyana': '🇬🇾',
    'Mauritania': '🇲🇷',
    'Haiti': '🇭🇹',
    'Burkina Faso': '🇧🇫',
    'Guinea Bissau': '🇬🇼',
    'Syria': '🇸🇾',
    'Cape Verde Islands': '🇨🇻',
    'Turkmenistan': '🇹🇲',
    'Grenada': '🇬🇩',
    'Oman': '🇴🇲',
    'New Zealand': '🇳🇿',
    'Malta': '🇲🇹',
    'Fiji': '🇫🇯',
    'Mozambique': '🇲🇿',
}

getRatingClass(rating: number): string {
  if (rating >= 85) return 'high-rating';
  if (rating >= 70) return 'medium-rating';
  return 'low-rating';
}



getPositionClass(position: string): string {
  switch (position) {
    case 'GK':
      return 'bg-primary'; // azul
    case 'CB':
    case 'LB':
    case 'RB':
    case 'LCB':
    case 'RCB':
      return 'bg-danger'; // rojo
    case 'CM':
    case 'CDM':
    case 'CAM':
    case 'LM':
    case 'RM':
      return 'bg-warning text-dark'; // amarillo
    case 'ST':
    case 'CF':
    case 'LW':
    case 'RW':
      return 'bg-success'; // verde
    default:
      return 'bg-secondary'; // gris
  }
}


}
