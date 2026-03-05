import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  foodCells = [
    { emoji: '🥗', bg: '#fde8d8' },
    { emoji: '🍓', bg: '#e8f0dd' },
    { emoji: '🥑', bg: '#fff3e0' },
    { emoji: '🍋', bg: '#fce4ec' },
  ];

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}