import { Routes } from '@angular/router'
import { CreateEmailComponent } from './create-email/create-email.component'
import { CreateGroupComponent } from './create-group/create-group.component'

export const routes: Routes = [
  { path: 'create-email', component: CreateEmailComponent },
  { path: 'create-group', component: CreateGroupComponent },
  { path: '', redirectTo: '/create-email', pathMatch: 'full' },
]
