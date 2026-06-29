import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

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
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'cliente' },
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
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'maestro' },
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
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/perfil-maestro/perfil-maestro.page')
                .then(m => m.PerfilMaestroPage)
          },
          {
            path: 'mis-datos',
            loadComponent: () =>
              import('./pages/perfil-maestro/components/mis-datos/mis-datos.component')
                .then(m => m.MisDatosComponent)
          },
          {
            path: 'experiencia',
            loadComponent: () =>
              import('./pages/perfil-maestro/components/experiencia-laboral/experiencia-laboral.component')
                .then(m => m.ExperienciaLaboralComponent)
          },
          {
            path: 'certificaciones',
            loadComponent: () =>
              import('./pages/perfil-maestro/components/certificaciones/certificaciones.component')
                .then(m => m.CertificacionesComponent)
          }
        ]
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

  // ── 404 ──────────────────────────────────────────────────────────────────
  {
    path: 'page-not-found',
    loadComponent: () =>
      import('./pages/page-not-found/page-not-found.page')
        .then(m => m.PageNotFoundPage)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/page-not-found/page-not-found.page')
        .then(m => m.PageNotFoundPage)
  }
];