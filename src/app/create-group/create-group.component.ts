import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { Apollo, gql } from 'apollo-angular'

import { ValidateEmailList } from '../services/email.validator'

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-group.component.html',
  styleUrls: ['../app.component.scss', './create-group.component.scss'],
})
export class CreateGroupComponent {
  groupCreated: boolean = false
  isErr: boolean = false
  showGroupForm: boolean = true
  loading: boolean = false

  constructor(private apollo: Apollo) {}

  CREATE_GROUP = gql`
    mutation AddGroup($recipients: String, $name: String) {
      addGroup(recipients: $recipients, name: $name) {
        success
        message
        code
      }
    }
  `

  groupConstructor = new FormGroup({
    name: new FormControl('', [Validators.required]),
    recipient: new FormControl('', [
      Validators.required,
      ValidateEmailList, //email Validation
    ]),
  })

  async onSubmit() {
    this.loading = true

    this.apollo
      .mutate({
        mutation: this.CREATE_GROUP,
        variables: {
          recipients: this.groupConstructor.value.recipient,
          name: this.groupConstructor.value.name,
        },
      })
      .subscribe((data: any) => {
        data = data.data
        console.log(data)
        if (!data.addGroup.success) {
          this.isErr = !this.isErr
          this.showGroupForm = !this.showGroupForm
          this.loading = false
          return
        }
        this.groupCreated = !this.groupCreated
        this.showGroupForm = !this.showGroupForm
        this.loading = false
      })
  }
}
