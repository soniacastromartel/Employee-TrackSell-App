import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    // canActivate: [AuthGuardService]
  },
  {
    path: 'rankings',
    loadChildren: () => import('./pages/rankings/rankings.module').then( m => m.RankingsPageModule)
  },
  {
    path: 'incentives',
    loadChildren: () => import('./pages/incentives/incentives.module').then( m => m.IncentivesPageModule)
  },
  {
    path: 'league',
    loadChildren: () => import('./pages/league/league.module').then( m => m.LeaguePageModule)
  }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
