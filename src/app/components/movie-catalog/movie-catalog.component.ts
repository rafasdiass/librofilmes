import {
  Component,
  OnInit,
  HostListener,
  effect,
  signal,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MovieApiService } from '../../shared/services/movie-api.service';
import { MoviePreviewCardComponent } from '../../shared/movie-preview-card/movie-preview-card.component';
import { Movie } from '../../shared/models/movie.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { MovieDetailModalComponent } from '../../shared/movie-detail-modal/movie-detail-modal.component';

@Component({
  selector: 'app-movie-catalog',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MoviePreviewCardComponent,
  ],
  templateUrl: './movie-catalog.component.html',
  styleUrls: ['./movie-catalog.component.scss'],
})
export class MovieCatalogComponent implements OnInit {
  readonly movies = signal<Movie[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly cols = signal(2);
  private readonly isBrowser: boolean;
  private popularMoviesSig: ReturnType<typeof toSignal<Movie[]>> | null = null;

  constructor(
    private readonly movieService: MovieApiService,
    private readonly dialog: MatDialog,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.popularMoviesSig = toSignal(
      this.movieService.getPopularMovies().pipe(
        tap((movies) => {
          this.isLoading.set(false);
          if (!movies?.length) {
            this.errorMessage.set('Nenhum filme encontrado!');
          }
        }),
        catchError((err: unknown) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            'Falha ao carregar a lista de filmes populares.'
          );
          return of<Movie[]>([]);
        })
      ),
      {
        initialValue: [],
      }
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
  onResize(event: UIEvent) {
    if (this.isBrowser) {
      const width = (event.target as Window).innerWidth;
      this.adjustCols(width);
    }
  }

  private adjustCols(width: number): void {
    if (width < 768) {
      this.cols.set(1);
    } else {
      this.cols.set(2);
    }
  }

  openMovieDetailModal(movieId: number): void {
    this.dialog.open(MovieDetailModalComponent, {
      data: { id: String(movieId) },
      width: '600px',
    });
  }
}
