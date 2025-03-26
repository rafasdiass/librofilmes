import { Injectable, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailModalComponent } from '../movie-detail-modal/movie-detail-modal.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class MovieModalService {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  /**
   * Abre o modal de detalhes do filme utilizando Angular Material.
   * Se já existir um modal aberto, não abre outro.
   */
  public openMovieModal(movieId: string): void {
    if (this.dialog.openDialogs.length > 0) return; // Modal já aberto

    const dialogRef = this.dialog.open(MovieDetailModalComponent, {
      data: { id: movieId },
      width: '600px',
    });

    // Converter afterClosed() em signal para reagir ao fechamento do modal
    const afterClosedSignal = toSignal(dialogRef.afterClosed(), {
      initialValue: null,
    });

    effect(() => {
      const closedValue = afterClosedSignal();
      if (closedValue !== null) {
        // Se necessário, navegue de volta ou realize outra ação
        if (this.router.url.includes('/filme/')) {
          this.router.navigate(['/']);
        }
      }
    });
  }
}
