import { Component, Inject, OnInit } from '@angular/core'
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { ValidateEmailList } from '../services/email.validator'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Apollo, gql } from 'apollo-angular'

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss',
})
export class EditDialogComponent implements OnInit {
  recipient = ''
  name = ''
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditDialogComponent>,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    // will log the entire data object
    this.name = this.data.name || ''
    this.recipient = this.data.recipient || ''
  }

  groupConstructor = new FormGroup({
    name: new FormControl(this.data.name, [Validators.required]),
    recipient: new FormControl(this.data.recipients, [
      Validators.required,
      ValidateEmailList, //email Validation
    ]),
  })

  submitValid = () => {
    return this.groupConstructor.valid && this.valuesHaveChanged()
  }

  valuesHaveChanged = () => {
    const values = this.groupConstructor.value
    const data = { name: this.data.name, recipient: this.data.recipients }
    const nameChange = values.name != data.name
    const recipientChange = values.recipient != data.recipient
    return nameChange || recipientChange
  }

  closeWithoutSaving($event: Event) {
    $event.preventDefault()
    this.dialogRef.close()
  }

  submit() {
    const value = this.groupConstructor.value
    const returnObj = {
      id: this.data.id,
      recipients: value.recipient,
      name: value.name,
    }
    this.dialogRef.close(returnObj)
  }
}
