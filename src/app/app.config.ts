import { ApplicationConfig } from '@angular/core';
import {
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  PreloadAllModules,
  withPreloading,
} from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Cliente HTTP com fetch (recomendado para SSR)
    provideHttpClient(withFetch()),

    // Rotas com pré-carregamento
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // Hidratação para SSR
    provideClientHydration(withEventReplay()),

    // Animações do Angular Material
    provideAnimations(),
  ],
};
