import {
  Injectable,
  computed,
  inject,
  signal,
  runInInjectionContext,
  Injector,
} from '@angular/core';
import { Movie, Genre, ApiResponse } from '../models/movie.model';
import { MovieApiService } from './movie-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface MovieState {
  movies: Movie[];
  genres: Genre[];
  selectedGenreId: number | null;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MovieStoreService {
  private readonly api = inject(MovieApiService);
  private readonly injector = inject(Injector);
  private lastRequestedPage: number | null = null;
  private readonly state = signal<MovieState>({
    movies: [],
    genres: [],
    selectedGenreId: null,
    isLoading: false,
    currentPage: 1,
    totalPages: 1,
    error: null,
  });
  readonly movies = computed(() => this.state().movies);
  readonly genres = computed(() => this.state().genres);
  readonly selectedGenreId = computed(() => this.state().selectedGenreId);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly currentPage = computed(() => this.state().currentPage);
  readonly totalPages = computed(() => this.state().totalPages);
  readonly error = computed(() => this.state().error);
  readonly hasMorePages = computed(
    () => this.state().currentPage < this.state().totalPages
  );
  readonly isLoadingNextPage = signal(false);

  startLoading(): void {
    this.updateState({ isLoading: true, error: null });
  }

  stopLoading(): void {
    this.updateState({ isLoading: false });
  }

  setError(error: string): void {
    this.updateState({ error, isLoading: false });
  }

  setGenres(genres: Genre[]): void {
    this.updateState({ genres });
  }

  setMovies(movies: Movie[], page: number, totalPages: number): void {
    this.updateState({
      movies,
      currentPage: page,
      totalPages,
      isLoading: false,
    });
  }

  appendMovies(newMovies: Movie[], page: number): void {
    this.updateState({
      movies: [...this.state().movies, ...newMovies],
      currentPage: page,
      isLoading: false,
    });
  }

  selectGenre(genreId: number | null): void {
    this.updateState({
      selectedGenreId: genreId,
      currentPage: 1,
      movies: [],
    });
    this.loadMovies(1);
  }

  clear(): void {
    this.state.set({
      movies: [],
      genres: [],
      selectedGenreId: null,
      isLoading: false,
      currentPage: 1,
      totalPages: 1,
      error: null,
    });
  }

  loadGenres(): void {
    this.startLoading();
    runInInjectionContext(this.injector, () => {
      this.api
        .getGenres()
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (response) => this.setGenres(response.genres),
          error: (err) => this.handleGenreError(err),
        });
    });
  }

  loadMovies(page: number): void {
    if (this.lastRequestedPage === page) {
      return;
    }
    this.lastRequestedPage = page;
    this.startLoading();
    const genreId = this.state().selectedGenreId;
    const request$ = genreId
      ? this.api.getMoviesByGenre(genreId, page)
      : this.api.getPopularMovies(page);
    runInInjectionContext(this.injector, () => {
      request$.pipe(takeUntilDestroyed()).subscribe({
        next: (response) => {
          this.handleMoviesResponse(response, page);
          this.lastRequestedPage = null;
        },
        error: (err) => {
          this.handleMoviesError(err);
          this.lastRequestedPage = null;
        },
      });
    });
  }

  loadNextPage(): void {
    if (this.isLoading() || this.isLoadingNextPage() || !this.hasMorePages())
      return;
    this.isLoadingNextPage.set(true);
    const nextPage = this.state().currentPage + 1;
    const genreId = this.state().selectedGenreId;
    const request$ = genreId
      ? this.api.getMoviesByGenre(genreId, nextPage)
      : this.api.getPopularMovies(nextPage);
    runInInjectionContext(this.injector, () => {
      request$.pipe(takeUntilDestroyed()).subscribe({
        next: (response) => {
          this.appendMovies(response.results, nextPage);
          this.isLoadingNextPage.set(false);
        },
        error: (err) => {
          this.handleMoviesError(err);
          this.isLoadingNextPage.set(false);
        },
      });
    });
  }

  private updateState(partialState: Partial<MovieState>): void {
    this.state.update((current) => ({ ...current, ...partialState }));
  }

  private handleMoviesResponse(
    response: ApiResponse<Movie>,
    page: number
  ): void {
    if (page === 1) {
      this.setMovies(response.results, page, response.total_pages);
    } else {
      this.appendMovies(response.results, page);
    }
  }

  private handleMoviesError(err: any): void {
    this.setError('Failed to load movies');
    console.error('Error loading movies:', err);
  }

  private handleGenreError(err: any): void {
    this.setError('Failed to load genres');
    console.error('Error loading genres:', err);
  }
}
