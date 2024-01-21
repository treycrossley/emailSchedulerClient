import { Component } from '@angular/core'
import {
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms'
import { Apollo, gql } from 'apollo-angular'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { CommonModule } from '@angular/common'

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-create-email',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-email.component.html',
  styleUrls: ['../app.component.scss', './create-email.component.scss'],
})
export class CreateEmailComponent {
  emailSent: boolean = false
  isErr: boolean = false
  showEmailForm: boolean = true
  loading: boolean = false

  constructor(private apollo: Apollo) {}

  SEND_EMAILS = gql`
    mutation sendEmail($recipient: String, $subject: String, $text: String) {
      sendEmail(recipient: $recipient, subject: $subject, text: $text) {
        code
        message
        success
      }
    }
  `

  emailConstructor = new FormGroup({
    recipient: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), //email Validation
    ]),
    subject: new FormControl('', [Validators.required]),
    body: new FormControl('', [Validators.required]),
  })

  onSubmit() {
    this.loading = true
    this.apollo
      .mutate({
        mutation: this.SEND_EMAILS,
        variables: {
          recipient: this.emailConstructor.value.recipient,
          subject: this.emailConstructor.value.subject,
          text: this.emailConstructor.value.body,
        },
      })
      .subscribe(
        ({ data }) => {
          console.log(data)
          this.emailSent = !this.emailSent
          this.showEmailForm = !this.showEmailForm
          this.loading = false
        },
        err => {
          console.error(err)
          this.isErr = !this.isErr
          this.showEmailForm = !this.showEmailForm
          this.loading = false
        }
      )
  }
}
