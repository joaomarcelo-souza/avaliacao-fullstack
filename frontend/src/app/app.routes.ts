import { Routes } from '@angular/router';
import { Home } from './pages/home/home.component';
import { Users } from './pages/users/users.component';
import { Register } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'users', component: Users },
  { path: 'register', component: Register },
  { path: 'update-user/:id', component: Register },
];
