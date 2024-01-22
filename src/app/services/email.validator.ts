import { AbstractControl } from '@angular/forms'

const emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'

export function ValidateEmailList(control: AbstractControl) {
  const emailList: Array<string> = control.value.split(',')
  const regex = new RegExp(emailRegex)

  let validator = null
  for (const email of emailList) {
    const mail = email.trim()
    if (!regex.test(mail)) {
      validator = { invalidUrl: true }
      break
    }
  }

  return validator
}

export function ValidateEmailString(emailString: string) {
  const emailList: Array<string> = emailString.split(',')
  const regex = new RegExp(emailRegex)

  let validator = null
  for (const email of emailList) {
    const mail = email.trim()
    if (!regex.test(mail)) {
      validator = { invalidUrl: true }
      break
    }
  }

  return validator
}
