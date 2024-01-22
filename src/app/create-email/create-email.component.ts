import { Component, OnDestroy, OnInit } from '@angular/core'
import {
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms'
import { Apollo, gql } from 'apollo-angular'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'

import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { CommonModule } from '@angular/common'
import { SingleFileUploadComponent } from '../single-file-upload/single-file-upload.component'

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { Subscription } from 'rxjs'

import { ValidateEmailString } from '../services/email.validator'

interface group {
  id: string
  recipients: string
  name: string
}

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
    MatSelectModule,
  ],
  templateUrl: './create-email.component.html',
  styleUrls: ['../app.component.scss', './create-email.component.scss'],
})
export class CreateEmailComponent implements OnInit, OnDestroy {
  emailSent: boolean = false
  isErr: boolean = false
  showEmailForm: boolean = true
  loading: boolean = false
  file: File | undefined = undefined // Variable to store file
  groupList: group[] = []
  private querySubscription: Subscription

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: this.GET_EMAIL_GROUPS,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading
        this.groupList = data.getGroups
      })
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe()
  }

  GET_EMAIL_GROUPS = gql`
    query Query {
      getGroups {
        recipients
        name
        id
      }
    }
  `

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

  emailConstructor = new FormGroup(
    {
      email_groups: new FormControl(''),
      recipient: new FormControl(''),
      subject: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required]),
    },
    this.emailExistsValidator
  )

  emailExistsValidator(control: AbstractControl) {
    const validator = { invalidInput: true }
    const { recipient, email_groups } = control.value
    const recipientsExist: boolean = recipient ? true : false
    const groupsExist =
      email_groups === undefined || email_groups.length == 0 ? false : true

    if (!recipientsExist && !groupsExist) return validator
    if (ValidateEmailString(recipient) != null && !groupsExist) return validator

    return null
  }

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

  getTotalRecipients() {
    const recipients = this.emailConstructor.value.recipient?.trim().split(',')
    const emailGroups = this.emailConstructor.value.email_groups
    if (emailGroups?.length !== undefined) {
      for (let i = 0; i < emailGroups?.length; i++) {
        recipients?.push(emailGroups[i])
      }
    }
    const uniqueList = [...new Set(recipients)]
    return uniqueList.toString()
  }

  async getFiles() {
    const files = []
    let path = null
    if (this.file) {
      path = await this.file2Base64(this.file)
      files.push({ filename: this.file?.name, path: path, encoding: 'base64' })
    }
    return files
  }

  async onSubmit() {
    this.loading = true
    const recipients = this.getTotalRecipients()
    const files = await this.getFiles()

    this.apollo
      .mutate({
        mutation: this.SEND_EMAILS,
        variables: {
          recipient: recipients,
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
