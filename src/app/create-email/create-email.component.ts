import { Component } from '@angular/core'
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms'
import { Apollo, gql } from 'apollo-angular'

@Component({
  selector: 'app-create-email',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-email.component.html',
  styleUrl: './create-email.component.scss',
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
          body: this.emailConstructor.value.body,
        },
      })
      .subscribe(
        ({ data }: any) => {
          console.log(data)
        },
        err => {
          console.error(err)
        }
      )
  }
}
