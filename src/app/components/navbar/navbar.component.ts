import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MovieNavbarService } from '../../shared/services/movie-navbar.service';
import { MovieStoreService } from '../../shared/services/movie-store.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  readonly genres = computed(() => this.store.genres());
  readonly selectedGenreId = computed(() => this.store.selectedGenreId());

  readonly isMenuOpen = signal(false);

  constructor(
    private readonly navbarService: MovieNavbarService,
    private readonly store: MovieStoreService
  ) {}

  ngOnInit(): void {
    this.navbarService.loadGenres();
  }

  selectGenre(id: number | null): void {
    this.navbarService.selectGenre(id);
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }
}
