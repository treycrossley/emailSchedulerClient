import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { MatIconModule } from '@angular/material/icon'
import { Apollo, gql } from 'apollo-angular'
import { Subscription } from 'rxjs'

interface group {
  id: string
  recipients: string
  name: string
}

@Component({
  selector: 'app-edit-group',
  standalone: true,
  imports: [MatTableModule, MatIconModule],
  templateUrl: './edit-group.component.html',
  styleUrl: './edit-group.component.scss',
})
export class EditGroupComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'recipients', 'functions']
  groupList: group[] = []
  loading: boolean = false
  private querySubscription: Subscription

  GET_EMAIL_GROUPS = gql`
    query Query {
      getGroups {
        recipients
        name
        id
      }
    }
  `

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

  edit = (event: Event, element: group) => {
    console.log(event, element)
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
