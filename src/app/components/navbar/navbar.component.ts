import { Component, OnInit } from '@angular/core';
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
  isMenuOpen = false;

  constructor(
    private readonly navbarService: MovieNavbarService,
    private readonly store: MovieStoreService
  ) {}

  // Getters para os signals do estado
  get genres() {
    return this.store.genres;
  }

  get selectedGenreId() {
    return this.store.selectedGenreId;
  }

  ngOnInit(): void {
    this.navbarService.initialize(); // Inicializa gêneros e aplica o filtro inicial
  }

  /**
   * Ao selecionar um gênero, atualiza o filtro e dispara o carregamento dos filmes.
   * @param id ID do gênero ou null para filmes populares.
   */
  selectGenre(id: number | null): void {
    this.navbarService.selectGenre(id);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Carrega filmes populares (sem filtro)
  loadPopularMovies(): void {
    this.navbarService.loadPopularMovies();
  }
}
