import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { CreateEmailComponent } from './create-email/create-email.component'
import { CreateGroupComponent } from './create-group/create-group.component'
import { SidebarComponent } from './sidebar/sidebar.component'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    CreateEmailComponent,
    CreateGroupComponent,
    SidebarComponent,
  ],
})
export class AppComponent {
  title = 'client'
}
