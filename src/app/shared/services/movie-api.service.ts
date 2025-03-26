import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie, Genre, ApiResponse } from '../models/movie.model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class MovieApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey = environment.tmdbApiKey;
  private readonly language = 'pt-BR';

  private get defaultParams(): HttpParams {
    return new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', this.language);
  }

  getPopularMovies(page = 1): Observable<ApiResponse<Movie>> {
    const params = this.defaultParams.set('page', page.toString());
    return this.http.get<ApiResponse<Movie>>(`${this.baseUrl}/movie/popular`, {
      params,
    });
  }

  getMovieById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.baseUrl}/movie/${id}`, {
      params: this.defaultParams,
    });
  }

  getGenres(): Observable<{ genres: Genre[] }> {
    return this.http.get<{ genres: Genre[] }>(
      `${this.baseUrl}/genre/movie/list`,
      { params: this.defaultParams }
    );
  }

  getMoviesByGenre(genreId: number, page = 1): Observable<ApiResponse<Movie>> {
    const params = this.defaultParams
      .set('with_genres', genreId.toString())
      .set('sort_by', 'popularity.desc')
      .set('page', page.toString());

    return this.http.get<ApiResponse<Movie>>(`${this.baseUrl}/discover/movie`, {
      params,
    });
  }
}
