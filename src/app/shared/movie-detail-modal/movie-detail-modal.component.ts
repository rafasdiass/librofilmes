import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MovieApiService } from '../../shared/services/movie-api.service';
import { Movie } from '../../shared/models/movie.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-movie-detail-modal',
  templateUrl: './movie-detail-modal.component.html',
  styleUrls: ['./movie-detail-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
})
export class MovieDetailModalComponent implements OnInit {
  movie: Movie | null = null;
  isLoading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private dialogRef: MatDialogRef<MovieDetailModalComponent>,
    private movieService: MovieApiService
  ) {}

  ngOnInit(): void {
    this.loadMovieDetail();
  }

  loadMovieDetail(): void {
    if (!this.data.id) {
      this.isLoading = false;
      return;
    }
    this.movieService
      .getMovieById(this.data.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (detail: Movie) => {
          this.movie = detail;
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes do filme:', err);
        },
      });
  }

  get posterUrl(): string {
    return this.movie
      ? `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`
      : '';
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
