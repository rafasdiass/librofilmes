import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  HostListener,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MoviePreviewCardComponent } from '../../shared/movie-preview-card/movie-preview-card.component';
import { MovieDetailModalComponent } from '../../shared/movie-detail-modal/movie-detail-modal.component';
import { MovieStoreService } from '../../shared/services/movie-store.service';
import { PLATFORM_ID } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-movie-catalog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MoviePreviewCardComponent,
    MatCard,
    MatToolbar,
  ],
  templateUrl: './movie-catalog.component.html',
  styleUrls: ['./movie-catalog.component.scss'],
})
export class MovieCatalogComponent implements OnInit, AfterViewInit, OnDestroy {
  public readonly store = inject(MovieStoreService);
  private readonly dialog = inject(MatDialog);
  private readonly isBrowser: boolean = inject(PLATFORM_ID) === 'browser';
  readonly movies = this.store.movies;
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;
  readonly errorMessage = computed(() => this.error());
  readonly cols = signal(2);
  readonly moviesCount = computed(() => this.movies().length);
  private readonly scrollDebounce = signal<NodeJS.Timeout | null>(null);
  @ViewChild('scrollAnchor', { static: false })
  scrollAnchor!: ElementRef<HTMLDivElement>;
  private intersectionObserver?: IntersectionObserver;
  readonly moviesByGenre = computed(() => {
    const groups: { [genreId: number]: any[] } = {};
    const movies = this.movies();
    const genres = this.store.genres();
    genres.forEach((genre: any) => {
      groups[genre.id] = movies.filter(
        (movie: any) =>
          movie.genre_ids &&
          Array.isArray(movie.genre_ids) &&
          movie.genre_ids.includes(genre.id)
      );
    });
    return groups;
  });
  readonly moviesByGenreRows = computed(() => {
    const groups: { [genreId: number]: any[][] } = {};
    const groupsFlat = this.moviesByGenre();
    for (const genreId in groupsFlat) {
      const movies = groupsFlat[genreId];
      const half = Math.ceil(movies.length / 2);
      groups[genreId] = [movies.slice(0, half), movies.slice(half)];
    }
    return groups;
  });

  ngOnInit(): void {
    if (this.isBrowser) {
      this.adjustCols(window.innerWidth);
    }
    if (this.moviesCount() === 0) {
      this.store.loadMovies(1);
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.scrollAnchor) {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !this.isLoading() &&
            this.store.hasMorePages()
          ) {
            this.store.loadNextPage();
          }
        });
      });
      this.intersectionObserver.observe(this.scrollAnchor.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    if (this.isBrowser) {
      const windowWidth = (event.target as Window).innerWidth;
      this.adjustCols(windowWidth);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.isBrowser) return;
    if (this.scrollDebounce()) {
      clearTimeout(this.scrollDebounce()!);
    }
    this.scrollDebounce.set(
      setTimeout(() => {
        const scrollThreshold = 300;
        const nearBottom =
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - scrollThreshold;
        if (nearBottom && !this.isLoading() && this.store.hasMorePages()) {
          this.store.loadNextPage();
        }
      }, 200)
    );
  }

  private adjustCols(windowWidth: number): void {
    if (windowWidth < 576) {
      this.cols.set(1);
    } else if (windowWidth >= 576 && windowWidth < 768) {
      this.cols.set(2);
    } else if (windowWidth >= 768 && windowWidth < 992) {
      this.cols.set(3);
    } else if (windowWidth >= 992 && windowWidth < 1200) {
      this.cols.set(4);
    } else {
      this.cols.set(5);
    }
  }

  openMovieDetailModal(movieId: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.dialog.open(MovieDetailModalComponent, {
      data: { id: String(movieId) },
      width: '600px',
    });
  }

  reloadMovies(): void {
    this.store.loadMovies(1);
  }
}
