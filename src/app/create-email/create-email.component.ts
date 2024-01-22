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
import { SingleFileUploadComponent } from '../single-file-upload/single-file-upload.component'

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

import { ValidateEmailList } from '../services/email.validator'

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
    SingleFileUploadComponent,
  ],
  templateUrl: './create-email.component.html',
  styleUrls: ['../app.component.scss', './create-email.component.scss'],
})
export class CreateEmailComponent {
  emailSent: boolean = false
  isErr: boolean = false
  showEmailForm: boolean = true
  loading: boolean = false
  file: File | undefined = undefined // Variable to store file

  constructor(private apollo: Apollo) {}

  SEND_EMAILS = gql`
    mutation sendEmail(
      $recipient: String
      $subject: String
      $text: String
      $attachments: [Attachment]
    ) {
      sendEmail(
        recipient: $recipient
        subject: $subject
        text: $text
        attachments: $attachments
      ) {
        code
        message
        success
      }
    }
  `

  emailConstructor = new FormGroup({
    recipient: new FormControl('', [Validators.required, ValidateEmailList]),
    subject: new FormControl('', [Validators.required]),
    body: new FormControl('', [Validators.required]),
  })

  getFile(file: File): void {
    this.file = file
  }

  file2Base64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result?.toString() || '')
      reader.onerror = error => reject(error)
    })
  }

  async onSubmit() {
    this.loading = true

    const files = []
    let path = null
    if (this.file) {
      path = await this.file2Base64(this.file)
      files.push({ filename: this.file?.name, path: path, encoding: 'base64' })
    }

    this.apollo
      .mutate({
        mutation: this.SEND_EMAILS,
        variables: {
          recipient: this.emailConstructor.value.recipient,
          subject: this.emailConstructor.value.subject,
          text: this.emailConstructor.value.body,
          attachments: files,
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
