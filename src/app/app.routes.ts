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

  // ── TABS CLIENTE ──────────────────────────────────────────────────────────
  {
    path: 'cliente',
    loadComponent: () =>
      import('./pages/tabs-cliente/tabs-cliente.page')
        .then(m => m.TabsClientePage),
    children: [
      {
        path: 'home',
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
        path: 'perfil',
        loadComponent: () =>
          import('./pages/perfil-cliente/perfil-cliente.page')
            .then(m => m.PerfilClientePage)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },

  // ── TABS MAESTRO ──────────────────────────────────────────────────────────
  {
    path: 'maestro',
    loadComponent: () =>
      import('./pages/tabs-maestro/tabs-maestro.page')
        .then(m => m.TabsMaestroPage),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home-maestro/home-maestro.page')
            .then(m => m.HomeMaestroPage)
      },
      {
        path: 'solicitudes',
        loadComponent: () =>
          import('./pages/solicitudes-maestro/solicitudes-maestro.page')
            .then(m => m.SolicitudesMaestroPage)
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./pages/perfil-maestro/perfil-maestro.page')
            .then(m => m.PerfilMaestroPage)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },

  // ── PÁGINAS INDEPENDIENTES ────────────────────────────────────────────────
  {
    path: 'detalle-maestro/:id',
    loadComponent: () =>
      import('./pages/detalle-maestro/detalle-maestro.page')
        .then(m => m.DetalleMaestroPage)
  },

  {
    path: '**',
    redirectTo: 'onboarding'
  }
];