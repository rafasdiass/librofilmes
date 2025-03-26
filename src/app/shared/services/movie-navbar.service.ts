import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { MovieStoreService } from './movie-store.service';

@Injectable({
  providedIn: 'root',
})
export class MovieNavbarService {
  private readonly store = inject(MovieStoreService);

  /**
   * Signal para armazenar o gênero selecionado, inicializado a partir do localStorage, se disponível.
   */
  readonly selectedGenreId = signal<number | null>(
    this.getInitialSelectedGenre()
  );

  constructor() {
    // Sempre que o gênero selecionado mudar, persiste o valor no localStorage, se estiver disponível.
    effect(() => {
      const genre = this.selectedGenreId();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(
          'selectedGenre',
          genre !== null ? genre.toString() : ''
        );
      }
    });
  }

  /**
   * Recupera o valor inicial armazenado no localStorage (se disponível).
   * Se localStorage não estiver definido (ex.: no SSR), retorna null.
   */
  private getInitialSelectedGenre(): number | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const stored = localStorage.getItem('selectedGenre');
    return stored ? Number(stored) : null;
  }

  /**
   * Inicializa o serviço carregando os gêneros e aplicando o filtro inicial.
   */
  initialize(): void {
    this.store.loadGenres();
    // Aplica o filtro com o gênero armazenado ou nulo (filmes populares)
    this.store.selectGenre(this.selectedGenreId());
  }

  /**
   * Carrega filmes populares, limpando o filtro de gênero.
   */
  loadPopularMovies(): void {
    this.selectedGenreId.set(null);
    this.store.selectGenre(null);
  }

  /**
   * Seleciona um gênero específico e atualiza o estado do filtro.
   * @param genreId ID do gênero ou null para todos os filmes.
   */
  selectGenre(genreId: number | null): void {
    this.selectedGenreId.set(genreId);
    this.store.selectGenre(genreId);
  }

  /**
   * Carrega a próxima página de filmes.
   */
  loadNextPage(): void {
    this.store.loadNextPage();
  }
}
