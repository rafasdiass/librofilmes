import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../models/movie.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-movie-preview-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './movie-preview-card.component.html',
  styleUrls: ['./movie-preview-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviePreviewCardComponent implements OnChanges {
  @Input() public movie: Movie | null = null;
  private readonly localMovieSignal = signal<Movie | null>(null);
  public readonly posterUrlSignal = signal<string>('');

  public get posterUrl(): string {
    return this.posterUrlSignal();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['movie']) {
      try {
        if (this.movie === null) {
          this.localMovieSignal.set(null);
          this.posterUrlSignal.set('');
        } else {
          this.localMovieSignal.set(this.movie);
          const moviePosterPath = this.movie.poster_path ?? '';
          if (moviePosterPath !== '') {
            this.posterUrlSignal.set(
              `https://image.tmdb.org/t/p/w500${moviePosterPath}`
            );
          } else {
            this.posterUrlSignal.set('');
          }
        }
      } catch (error) {
        console.error(
          'Erro ao processar a alteração do filme no MoviePreviewCardComponent:',
          error
        );
        this.localMovieSignal.set(null);
        this.posterUrlSignal.set('');
      }
    }
  }

  public getLocalMovie(): Movie | null {
    return this.localMovieSignal();
  }
}
