import { Injectable, effect, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
   * Converte os eventos de navegação (NavigationEnd) em um signal
   */
  private readonly navigationEndSignal = toSignal(
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)),
    { initialValue: null }
  );

  constructor() {
    // Efeito: observa a navigationEndSignal para ver se a rota é "/filme/:id"
    effect(() => {
      const event = this.navigationEndSignal();
      if (!event) return;
      const url = this.router.url; // ex: '/filme/123'
      const match = url.match(/^\/filme\/(\w+)/);
      if (match && match[1]) {
        this.openModal(match[1]);
      }
    });
  }

  private openModal(movieId: string): void {
    if (this.dialog.openDialogs.length > 0) return; // já existe modal aberto

    const dialogRef = this.dialog.open(MovieDetailModalComponent, {
      data: { id: movieId },
      width: '600px',
    });

    // Converter afterClosed() em signal
    const afterClosedSignal = toSignal(dialogRef.afterClosed(), {
      // se preferir, pode ser undefined ou null
      initialValue: null,
    });

    // Efeito que reage quando o modal é fechado
    effect(() => {
      const closedValue = afterClosedSignal();
      // Se for 'null', significa que ainda não fechou.
      // Assim que fechar, closedValue deixa de ser 'null' (geralmente é 'undefined' ou outro)
      if (closedValue !== null) {
        // se ainda estiver em '/filme/...' depois do fechamento, volta para '/'
        if (this.router.url.includes('/filme/')) {
          this.router.navigate(['/']);
        }
      }
    });
  }
}
