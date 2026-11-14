import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';

const publicChildren: Routes = [
  {
    path: '',
    title: 'SELECTA EMPIRE LIMITED',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'a-propos',
    loadComponent: () => import('./pages/about/about.page').then((m) => m.AboutPage),
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.page').then((m) => m.ServicesPage),
  },
  {
    path: 'couverture-conferences',
    loadComponent: () =>
      import('./pages/conference/conference.page').then((m) => m.ConferencePage),
  },
  {
    path: 'services/:slug',
    loadComponent: () =>
      import('./pages/service-detail/service-detail.page').then((m) => m.ServiceDetailPage),
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./pages/portfolio/portfolio.page').then((m) => m.PortfolioPage),
  },
  {
    path: 'realisations',
    loadComponent: () => import('./pages/projects/projects.page').then((m) => m.ProjectsPage),
  },
  {
    path: 'realisations/:slug',
    loadComponent: () =>
      import('./pages/project-detail/project-detail.page').then((m) => m.ProjectDetailPage),
  },
  {
    path: 'evenements',
    loadComponent: () => import('./pages/events/events.page').then((m) => m.EventsPage),
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog.page').then((m) => m.BlogPage),
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/article/article.page').then((m) => m.ArticlePage),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.page').then((m) => m.ContactPage),
  },
  {
    path: 'devis',
    loadComponent: () => import('./pages/quote/quote.page').then((m) => m.QuotePage),
  },
  {
    path: 'mentions-legales',
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.LegalPage),
  },
  {
    path: 'confidentialite',
    loadComponent: () => import('./pages/privacy/privacy.page').then((m) => m.PrivacyPage),
  },
  {
    path: 'conditions-generales',
    loadComponent: () => import('./pages/terms/terms.page').then((m) => m.TermsPage),
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
];

export const routes: Routes = [
  {
    path: 'en',
    component: PublicLayoutComponent,
    children: publicChildren,
  },
  {
    path: '',
    component: PublicLayoutComponent,
    children: publicChildren,
  },
];
