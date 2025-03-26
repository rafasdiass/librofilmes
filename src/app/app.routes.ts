import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'filme/:id',
    loadComponent: () =>
      import('./components/movie-detail-view/movie-detail-view.component').then(
        (m) => m.MovieDetailViewComponent
      ),
  },
];
