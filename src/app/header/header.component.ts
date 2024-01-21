import { Component } from '@angular/core'

import { MatToolbarModule } from '@angular/material/toolbar'

import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { RouterLink } from '@angular/router'

import { MatMenuModule } from '@angular/material/menu'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatMenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  routes = [
    { title: 'Send Email', route: '/create-email' },
    { title: 'Create Email Group', route: '/create-group' },
  ]
}
