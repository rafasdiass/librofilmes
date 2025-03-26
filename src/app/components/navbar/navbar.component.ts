import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MovieNavbarService } from '../../shared/services/movie-navbar.service';
import { MovieStoreService } from '../../shared/services/movie-store.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private readonly navbarService: MovieNavbarService,
    private readonly store: MovieStoreService
  ) {}

  get genres() {
    return this.store.genres;
  }

  get selectedGenreId() {
    return this.store.selectedGenreId;
  }

  ngOnInit(): void {
    this.navbarService.initialize();
  }

  selectGenre(id: number | null): void {
    this.navbarService.selectGenre(id);
  }

  loadPopularMovies(): void {
    this.navbarService.loadPopularMovies();
  }
}
