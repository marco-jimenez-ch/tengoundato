import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full'
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./pages/onboarding/onboarding.page')
        .then(m => m.OnboardingPage)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page')
        .then(m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.page')
        .then(m => m.RegistroPage)
  },
  {
    path: 'home-cliente',
    loadComponent: () =>
      import('./pages/home-cliente/home-cliente.page')
        .then(m => m.HomeClientePage)
  },
  {
    path: 'listado',
    loadComponent: () =>
      import('./pages/listado/listado.page')
        .then(m => m.ListadoPage)
  },
  {
    path: 'detalle-maestro/:id',
    loadComponent: () =>
      import('./pages/detalle-maestro/detalle-maestro.page')
        .then(m => m.DetalleMaestroPage)
  },
  {
    path: 'perfil-cliente',
    loadComponent: () =>
      import('./pages/perfil-cliente/perfil-cliente.page')
        .then(m => m.PerfilClientePage)
  },
  {
    path: 'home-maestro',
    loadComponent: () =>
      import('./pages/home-maestro/home-maestro.page')
        .then(m => m.HomeMaestroPage)
  },
  {
    path: 'solicitudes-maestro',
    loadComponent: () =>
      import('./pages/solicitudes-maestro/solicitudes-maestro.page')
        .then(m => m.SolicitudesMaestroPage)
  },
  {
    path: 'perfil-maestro',
    loadComponent: () =>
      import('./pages/perfil-maestro/perfil-maestro.page')
        .then(m => m.PerfilMaestroPage)
  },
  {
    path: '**',
    redirectTo: 'onboarding'
  }
];