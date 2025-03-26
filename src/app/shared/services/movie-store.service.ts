import { Injectable, signal } from '@angular/core';
import { Movie } from '../models/movie.model';
import { Genre } from '../models/genre.model';

@Injectable({
  providedIn: 'root',
})
export class MovieStoreService {
  readonly movies = signal<Movie[]>([]);
  readonly genres = signal<Genre[]>([]);
  readonly selectedGenreId = signal<number | null>(null);
  readonly isLoading = signal<boolean>(false);

  /** Atribui nova lista de filmes */
  setMovies(movies: Movie[]) {
    this.movies.set(movies);
  }

  /** Atribui nova lista de gêneros */
  setGenres(genres: Genre[]) {
    this.genres.set(genres);
  }

  /** Define o gênero selecionado */
  selectGenre(id: number | null) {
    this.selectedGenreId.set(id);
  }

  /** Controla estado de loading */
  setLoading(value: boolean) {
    this.isLoading.set(value);
  }

  /** Reset completo */
  clear() {
    this.movies.set([]);
    this.selectedGenreId.set(null);
    this.isLoading.set(false);
  }
}
