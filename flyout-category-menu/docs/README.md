# Biscoind Flyout Category Menu

The mutations and queries needed to schedule updates on the category tree should be added via the GraphQL admin IDE.  
Follow the instructions below to access the GraphQL admin IDE.  

1. In your browser, access your account's admin and select the GraphQL admin IDE in the side-bar menu.  
[https://biscoind.myvtex.com/admin](https://biscoind.myvtex.com/admin)  
2. From the dropdown list, choose the `biscoind.flyout-category-menu@0.x` app 
3. Copy the commands presented below to the text box that is displayed and update the from and to values as needed.  

This scheduler app allows to create a schedule, view and delete an existing schedule.  

| GraphQl operation name | Operation type |Description|
| ------------------- | ----------- | ----------|
| `createSynchronizerSchedule` |Mutation |Creates/updates schedule and initiates the schedule at the given time|
| `viewSynchronizerSchedule` |Query|View available schedule|
| `deleteSynchronizerSchedule`|Mutation| Delete existing schedule |

### Mutation to update category tree in VBase 

The category tree is updated on a time specified in the createCatalogSyncSchedule mutation.  

```
mutation {
  createSynchronizerSchedule(
    expression: "0 0 * * *",
    endDate: "2030-11-26T23:29:00",
    treeLevel: 3
  ){
    nextExecution
  }
}
```
`expression` is the cron expression which indicates the time or the periodic interval on which the scheduler should 
run.  
`endDate` is the date and time to stop the scheduler.  
`treeLevel` is the category tree level which should be updated.  
`nextExecution` is the returned value reference given in **PST** (Pacific Standard Time).

### Mutation to delete the existing schedules category tree in VBase

```
mutation {
  deleteSynchronizerSchedule
}
```

### Query to view the existing schedules category tree in VBase

```
query {
  viewSynchronizerSchedule {
    nextExecution
  }
}

```
