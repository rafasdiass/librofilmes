import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../models/movie.model';
import { Genre } from '../models/genre.model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class MovieApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  // Chave de API do environment
  private readonly apiKey = environment.tmdbApiKey || 'COLOQUE_SUA_CHAVE_AQUI';

  /** Linguagem default */
  private readonly language = 'pt-BR';

  private get authParams(): HttpParams {
    return new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', this.language);
  }

  getPopularMovies(page = 1): Observable<Movie[]> {
    const params = this.authParams.set('page', page.toString());

    return this.http
      .get<{ results: Movie[] }>(`${this.baseUrl}/movie/popular`, { params })
      .pipe(map((res) => res.results));
  }

  getMovieById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.baseUrl}/movie/${id}`, {
      params: this.authParams,
    });
  }

  getGenres(): Observable<Genre[]> {
    return this.http
      .get<{ genres: Genre[] }>(`${this.baseUrl}/genre/movie/list`, {
        params: this.authParams,
      })
      .pipe(map((res) => res.genres));
  }

  getMoviesByGenre(genreId: number, page = 1): Observable<Movie[]> {
    const params = this.authParams
      .set('with_genres', genreId)
      .set('sort_by', 'popularity.desc')
      .set('page', page.toString());

    return this.http
      .get<{ results: Movie[] }>(`${this.baseUrl}/discover/movie`, { params })
      .pipe(map((res) => res.results));
  }
}
