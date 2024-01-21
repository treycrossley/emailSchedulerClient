import { Component } from '@angular/core'
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms'
import { Apollo, gql } from 'apollo-angular'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'

@Component({
  selector: 'app-create-email',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  templateUrl: './create-email.component.html',
  styleUrls: ['../app.component.scss', './create-email.component.scss'],
})
export class CreateEmailComponent {
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
    recipient: new FormControl(''),
    subject: new FormControl(''),
    body: new FormControl(''),
  })

  onSubmit() {
    //TODO
    console.log(this.emailConstructor.value)
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
        },
        err => {
          console.error(err)
        }
      )
  }
}
