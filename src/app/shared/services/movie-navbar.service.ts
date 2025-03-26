import { Injectable, inject } from '@angular/core';
import { MovieApiService } from './movie-api.service';
import { MovieStoreService } from './movie-store.service';

@Injectable({
  providedIn: 'root',
})
export class MovieNavbarService {
  private readonly api = inject(MovieApiService);
  private readonly store = inject(MovieStoreService);

  /** Carrega os gêneros no início da aplicação */
  loadGenres(): void {
    this.store.setLoading(true);

    this.api.getGenres().subscribe({
      next: (genres) => {
        this.store.setGenres(genres);
        this.store.setLoading(false);
      },
      error: (err) => {
        console.error('Erro ao carregar gêneros:', err);
        this.store.setLoading(false);
      },
    });
  }

  /** Seleciona um gênero e atualiza os filmes de acordo */
  selectGenre(genreId: number | null): void {
    this.store.selectGenre(genreId);
    this.store.setLoading(true);

    const fetch$ = genreId
      ? this.api.getMoviesByGenre(genreId)
      : this.api.getPopularMovies();

    fetch$.subscribe({
      next: (movies) => {
        this.store.setMovies(movies);
        this.store.setLoading(false);
      },
      error: (err) => {
        console.error('Erro ao buscar filmes por gênero:', err);
        this.store.setLoading(false);
      },
    });
  }
}
