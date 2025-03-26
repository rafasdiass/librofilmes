import {
  Component,
  OnInit,
  HostListener,
  effect,
  signal,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MovieApiService } from '../../shared/services/movie-api.service';
import { MoviePreviewCardComponent } from '../../shared/movie-preview-card/movie-preview-card.component';
import { MovieDetailModalComponent } from '../../shared/movie-detail-modal/movie-detail-modal.component';
import { Movie } from '../../shared/models/movie.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-movie-catalog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MoviePreviewCardComponent,
  ],
  templateUrl: './movie-catalog.component.html',
  styleUrls: ['./movie-catalog.component.scss'],
})
export class MovieCatalogComponent implements OnInit {
  readonly movies = signal<Movie[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly cols = signal(2); // Bind para número de colunas

  private readonly isBrowser: boolean;
  private popularMoviesSig: ReturnType<typeof toSignal<Movie[]>> | null = null;

  constructor(
    private readonly movieService: MovieApiService,
    private readonly dialog: MatDialog,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.popularMoviesSig = toSignal(
      this.movieService.getPopularMovies().pipe(
        tap((list) => {
          this.isLoading.set(false);
          if (!list?.length) {
            this.errorMessage.set('Nenhum filme encontrado!');
          }
        }),
        catchError(() => {
          this.isLoading.set(false);
          this.errorMessage.set(
            'Falha ao carregar a lista de filmes populares.'
          );
          return of<Movie[]>([]);
        })
      ),
      { initialValue: [] }
    );

    effect(() => {
      const data = this.popularMoviesSig?.();
      if (data) {
        this.movies.set(data);
      }
    });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.adjustCols(window.innerWidth);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(e: UIEvent): void {
    if (this.isBrowser) {
      const width = (e.target as Window).innerWidth;
      this.adjustCols(width);
    }
  }

  private adjustCols(width: number): void {
    if (width < 576) {
      this.cols.set(1); // celular
    } else if (width >= 576 && width < 768) {
      this.cols.set(2); // tablets
    } else if (width >= 768 && width < 992) {
      this.cols.set(3); // notebooks
    } else if (width >= 992 && width < 1200) {
      this.cols.set(4); // desktops médios
    } else {
      this.cols.set(5); // telas grandes
    }
  }

  openMovieDetailModal(movieId: number, event: Event): void {
    // Previne o comportamento padrão e a propagação para evitar navegação
    event.preventDefault();
    event.stopPropagation();

    this.dialog.open(MovieDetailModalComponent, {
      data: { id: String(movieId) },
      width: '600px',
    });
  }
}
