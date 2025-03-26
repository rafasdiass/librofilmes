import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieApiService } from '../../shared/services/movie-api.service';
import { Movie } from '../../shared/models/movie.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Responsável por exibir o detalhe de um filme específico via rota (\"/filme/:id\").
 */
@Component({
  selector: 'app-movie-detail-view',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './movie-detail-view.component.html',
  styleUrls: ['./movie-detail-view.component.scss'],
})
export class MovieDetailViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly movieService = inject(MovieApiService);

  readonly movie = signal<Movie | null>(null);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.loadMovieDetail();
  }

  private loadMovieDetail(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading.set(false);
      return;
    }
    this.movieService.getMovieById(id).subscribe({
      next: (data: Movie) => {
        this.movie.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes do filme', err);
        this.isLoading.set(false);
      },
    });
  }

  get posterUrl(): string {
    const currentMovie = this.movie();
    return currentMovie
      ? `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`
      : '';
  }
}
