import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../models/movie.model';
import { MatCardModule } from '@angular/material/card';

/**
 * Card que exibe um preview do filme.
 * Agora, esse componente se limita à exibição dos dados e não gerencia a navegação.
 */
@Component({
  selector: 'app-movie-preview-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './movie-preview-card.component.html',
  styleUrls: ['./movie-preview-card.component.scss'],
})
export class MoviePreviewCardComponent {
  /**
   * Signal que armazena o objeto do filme local.
   */
  private readonly _movie = signal<Movie | null>(null);

  /**
   * Signal que armazena a URL do poster.
   */
  readonly posterUrl = signal<string>('');

  /**
   * Input property. Recebe o filme e monta a URL do poster.
   */
  @Input()
  set movie(value: Movie | null) {
    try {
      if (!value) {
        this._movie.set(null);
        this.posterUrl.set('');
        return;
      }
      this._movie.set(value);

      const path = value.poster_path ?? '';
      if (path) {
        this.posterUrl.set(`https://image.tmdb.org/t/p/w500${path}`);
      } else {
        this.posterUrl.set('');
      }
    } catch (error) {
      console.error('Erro ao definir o movie no preview card:', error);
      this._movie.set(null);
      this.posterUrl.set('');
    }
  }

  get movie(): Movie | null {
    return this._movie();
  }
}
