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

/**
 * Card que exibe um preview do filme.
 * Esse componente se limita à exibição dos dados e não gerencia a navegação.
 */
@Component({
  selector: 'app-movie-preview-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './movie-preview-card.component.html',
  styleUrls: ['./movie-preview-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviePreviewCardComponent implements OnChanges {
  /**
   * Propriedade de entrada. Recebe o objeto do filme e dispara a atualização dos signals.
   */
  @Input() public movie: Movie | null = null;

  /**
   * Signal que armazena o objeto do filme local.
   */
  private readonly localMovieSignal = signal<Movie | null>(null);

  /**
   * Signal que armazena a URL do poster.
   */
  public readonly posterUrlSignal = signal<string>('');

  /**
   * Getter para acessar o valor atual da URL do poster.
   */
  public get posterUrl(): string {
    return this.posterUrlSignal();
  }

  /**
   * Método do ciclo de vida chamado sempre que houver alteração em alguma propriedade de entrada.
   * Atualiza os signals de filme e URL do poster com base na nova entrada.
   */
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

  /**
   * Método getter para retornar o objeto do filme armazenado localmente.
   */
  public getLocalMovie(): Movie | null {
    return this.localMovieSignal();
  }
}
