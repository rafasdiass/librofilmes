import { Component, OnInit, inject, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MovieApiService } from '../../shared/services/movie-api.service';
import { Movie } from '../../shared/models/movie.model';

/**
 * Componente de modal para exibir detalhes de um filme.
 * Recebe { id: string } via MAT_DIALOG_DATA e carrega detalhes via MovieApiService.
 */
@Component({
  selector: 'app-movie-detail-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './movie-detail-modal.component.html',
  styleUrls: ['./movie-detail-modal.component.scss'],
})
export class MovieDetailModalComponent implements OnInit {
  private readonly movieService = inject(MovieApiService);
  private readonly dialogRef = inject(MatDialogRef<MovieDetailModalComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) private readonly data: { id: string }) {}

  readonly movie = signal<Movie | null>(null);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.loadMovieDetail();
  }

  private loadMovieDetail(): void {
    const movieId = this.data.id;
    if (!movieId) {
      this.isLoading.set(false);
      return;
    }
    this.movieService.getMovieById(movieId).subscribe({
      next: (detail: Movie) => {
        this.movie.set(detail);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes do filme (modal):', err);
        this.isLoading.set(false);
      },
    });
  }

  get posterUrl(): string {
    const current = this.movie();
    return current
      ? `https://image.tmdb.org/t/p/w500${current.poster_path}`
      : '';
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
