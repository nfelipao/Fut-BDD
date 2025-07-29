import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlayerComponent } from './components/player/player';

@Component({
  selector: 'app-root',
  imports: [PlayerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
