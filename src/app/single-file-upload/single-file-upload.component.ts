import { Component, EventEmitter, Output } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import send from 'send'

@Component({
  selector: 'app-single-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-file-upload.component.html',
  styleUrl: './single-file-upload.component.scss',
})
export class SingleFileUploadComponent {
  file: File | undefined = undefined // Variable to store file

  @Output()
  notify: EventEmitter<File> = new EventEmitter<File>()

  sendFile(): void {
    this.notify.emit(this.file)
  }

  constructor(private http: HttpClient) {}

  // On file Select
  onChange(event: any) {
    const file: File = event.target.files[0]
    if (file) {
      this.file = file
      this.sendFile()
    }
  }

  onUpload() {
    // we will implement this method later
  }
}
