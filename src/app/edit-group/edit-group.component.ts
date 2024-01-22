import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { MatIconModule } from '@angular/material/icon'
import { Apollo, gql } from 'apollo-angular'
import { Subscription } from 'rxjs'

import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog'
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component'

interface group {
  id: string
  recipients: string
  name: string
}

@Component({
  selector: 'app-edit-group',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatDialogModule],
  templateUrl: './edit-group.component.html',
  styleUrl: './edit-group.component.scss',
})
export class EditGroupComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'recipients', 'functions']
  groupList: group[] = []
  loading: boolean = false
  private querySubscription: Subscription
  dialogRef: MatDialogRef<EditDialogComponent>

  GET_EMAIL_GROUPS = gql`
    query Query {
      getGroups {
        recipients
        name
        id
      }
    }
  `

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog
  ) {}
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

  modalOpener(element: group) {
    this.dialogRef = this.dialog.open(EditDialogComponent, {
      width: '50em',
      height: '35em',
      data: element,
    })
    this.dialogRef.afterClosed().subscribe(result => {
      this.edit(result)
    })
  }

  UPDATE_EMAIL_GROUP = gql`
    mutation UpdateGroup(
      $updateGroupId: String
      $recipients: String
      $name: String
      $identifier: String
    ) {
      updateGroup(
        id: $updateGroupId
        recipients: $recipients
        name: $name
        identifier: $identifier
      ) {
        success
        message
        code
      }
    }
  `

  edit = (element: group) => {
    console.log(element)
    const { id, recipients, name } = element

    this.apollo
      .mutate({
        mutation: this.UPDATE_EMAIL_GROUP,
        variables: { recipients, name, identifier: id },
      })
      .subscribe((data: any) => {
        data = data.data
        console.log(data)
        console.log(this.groupList)
        this.loading = false
        location.reload()
      })
  }

  async delete(event: Event, element: group) {
    this.groupList = this.groupList.filter(e => {
      e.id != element.id
    })

    this.apollo
      .mutate({
        mutation: gql`
          mutation {
            deleteGroup(id: "${element.id}") {
              success
              message
              code
            }
          }
        `,
      })
      .subscribe((data: any) => {
        data = data.data
        console.log(data)
        console.log(this.groupList)
        this.loading = false
      })
  }
}
