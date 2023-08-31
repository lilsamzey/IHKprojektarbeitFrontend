



import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StudentsService } from '../../students/all-students/students.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Students } from '../../students/all-students/students.model';
import { DataSource } from '@angular/cdk/collections';
import {EditComponent} from '../../students/all-students/dialogs/edit/edit.component'
import {AddadminComponent} from '../admins/addadmin/addadmin.component';
import {AdminserviceService} from '../admins/adminservice.service'


import {DeleteComponent} from '../admins/delete/delete.component'

import {EditadminComponent} from '../admins/editadmin/editadmin.component'


import {StudentdetailsComponent} from '../../students/studentdetails/studentdetails.component';
import {AdmindetailsComponent} from '../admins/admindetails/admindetails.component'


import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogComponent } from '../../students/all-students/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from '../../students/all-students/dialogs/delete/delete.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { Direction } from '@angular/cdk/bidi';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { SendEmailComponent } from 'app/send-email/send-email.component';


import {AuthService} from '../../../core/service/auth.service'

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{


  displayedColumns = [
    'select',
    // 'img',
    'adminId',
    'firstName',
    'lastName',
     'mobile',
    'email',
    // 'address',
    'details',
    'actions',
  ];
  exampleDatabase?: StudentsService;

 allStudent:Students[]=[];

 allAdmins:any[]=[];
 originalAdmins: any[] = [];
 filteredAdmins: any[] = [];

 searchQuery = '';
 searchText = '';


 studentUserName!: string;
 studentUserPassword!: string;

  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Students>(true, []);
  id?: number;
  students?: Students;
  breadscrums = [
    {
      title: 'All Admins',
      items: ['Admins'],
      active: 'All Admin',
    },
  ];


  adminId!: number;


  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public studentsService: StudentsService,
    private snackBar: MatSnackBar,
    private adminserviceService:AdminserviceService,


    public authService:AuthService
    //private studentdetailsComponent:StudentdetailsComponent
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  async ngOnInit(): Promise<void> {
    //this.loadData();


    this.getAllAdmins();

    this.refresh()





  }






  getAllAdmins(): void {
    this.adminserviceService.getAllAdmins().subscribe(
      (admins: any) => {
        this.allAdmins = admins;
        console.log('admins ',admins);
        this.filterAdmins()



      },
      (error) => {
        console.error('Hata:', error);
      }
    );}





    filterAdmins() {
      this.filteredAdmins = this.allAdmins.filter(admin => {
        return admin.firstName.toLowerCase().includes(this.searchText.toLowerCase());
      });
    }



















  refresh() {
    this.getAllAdmins();
  }


  async allStudentList(){
  try {
    this.allStudent = await this.studentsService.getAllStudentss();
    this.refresh()

  } catch (error) {
    console.error('Error:', error);
  }
  }


  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(AddadminComponent, {
      data: {
        students: this.students,
        action: 'add',
      },
      direction: tempDirection,

    } );



    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {

      this.refresh();

      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataServicex
        this.exampleDatabase?.dataChange.value.unshift(
          this.studentsService.getDialogData()
        );
        this.refreshTable();
        this.showNotification(
          'snackbar-success',
          'Add Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }






  editCall(row: any) {
    this.id = row.adminId;


    console.log('admin edit', row)

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(EditadminComponent, {
      data: {
        admin: row,
        action: 'edit',
      },
      direction: tempDirection,
    });



    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {

      this.refresh();

      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.StudentId === this.id
        );
        // Then you update that record using data from dialogData (values you enetered)
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value[foundIndex] =
            this.studentsService.getDialogData();

          // And lastly refresh table
          this.refreshTable();
          this.showNotification(
            'black',
            'Edit Record Successfully...!!!',
            'bottom',
            'center'
          );
        }
      }
    });

  }





  deleteItem(row: any) {
    this.adminId = row.adminId;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {

      this.refresh();
      if (result === 1) {
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.StudentId === this.id
        );
        // for delete we use splice in order to remove single object from DataService
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
          this.refreshTable();
          this.showNotification(
            'snackbar-danger',
            'Delete Record Successfully...!!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }











  async adminDetails(row: any) {


    this.id = row.adminId;


    console.log(row.adminId)



       let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dialogRef = this.dialog.open(AdmindetailsComponent, {
      data: {
        admin: row,
        action: 'edit',
      },
      direction: tempDirection,
    });


    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result === 1) {
    //     // When using an edit things are little different, firstly we find record inside DataService by id
    //     const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
    //       (x: any) => x.id === this.id
    //     );
    //     // Then you update that record using data from dialogData (values you enetered)
    //     if (foundIndex != null && this.exampleDatabase) {
    //       this.exampleDatabase.dataChange.value[foundIndex] =
    //         this.studentsService.getDialogData();
    //       // And lastly refresh table
    //       this.refreshTable();
    //       this.showNotification(
    //         'black',
    //         'Edit Record Successfully...!!!',
    //         'bottom',
    //         'center'
    //       );
    //     }
    //   }

    // })

  }



























  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
          this.selection.select(row)
        );
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index: number = this.dataSource.renderedData.findIndex(
        (d) => d === item
      );
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      this.exampleDatabase?.dataChange.value.splice(index, 1);
      this.refreshTable();
      this.selection = new SelectionModel<Students>(true, []);
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Record Delete Successfully...!!!',
      'bottom',
      'center'
    );
  }


  // public loadData() {
  //   this.exampleDatabase = this.studentsService;


  //   this.exampleDatabase = new StudentsService(this.httpClient, this.authService);
  //   this.dataSource = new ExampleDataSource(
  //     this.exampleDatabase,
  //     this.paginator,
  //     this.sort
  //   );
  //   this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
  //     () => {
  //       if (!this.dataSource) {
  //         return;
  //       }
  //       this.dataSource.filter = this.filter.nativeElement.value;
  //     }
  //   );
  // }
  // export table data in excel file

  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        'Roll No': x.rollNo,
        Name: x.firstName,
        Department: x.department,
        Gender: x.gender,
        Mobile: x.mobile,
        Email: x.email,

        //'Admission Date':
          //formatDate(new Date(x.date), 'yyyy-MM-dd', 'en') || '',
          //const formattedDate = isValidDate(dateValue) ? formatDate(dateValue) : 'N/A';
      }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  // context menu
  onContextMenu(event: MouseEvent, item: Students) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }





async studentDetails(row: any) {


    this.id = row.StudentId;


    console.log('detaydan gelen' + row.StudentId)

   await this.studentsService.getStudentUsersByStudentId(row.StudentId);

       let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dialogRef = this.dialog.open(StudentdetailsComponent, {
      data: {
        student: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
   // this.studentdetailsComponent.ngOnInit;

    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result === 1) {
    //     // When using an edit things are little different, firstly we find record inside DataService by id
    //     const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
    //       (x: { id: number | undefined; }) => x.id === this.id
    //     );
    //     // Then you update that record using data from dialogData (values you enetered)
    //     if (foundIndex != null && this.exampleDatabase) {
    //       this.exampleDatabase.dataChange.value[foundIndex] =
    //         this.studentsService.getDialogData();
    //       // And lastly refresh table
    //       this.refreshTable();
    //       this.showNotification(
    //         'black',
    //         'Edit Record Successfully...!!!',
    //         'bottom',
    //         'center'
    //       );
    //     }
    //   }

    // })

  }










  sendEmail(email:string){


    console.log('detaydan gelen' + email)

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(SendEmailComponent, {
      data: {
        email: email,
        action: 'edit',
      },
      direction: tempDirection,
    });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result === 1) {
    //     // When using an edit things are little different, firstly we find record inside DataService by id
    //     const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
    //       (x: { id: number | undefined; }) => x.id === this.id
    //     );
    //     // Then you update that record using data from dialogData (values you enetered)
    //     if (foundIndex != null && this.exampleDatabase) {
    //       this.exampleDatabase.dataChange.value[foundIndex] =
    //         this.teachersService.getDialogData();
          // And lastly refresh table
          // this.refreshTable();
          // this.showNotification(
          //   'black',
          //   'Edit Record Successfully...!!!',
          //   'bottom',
          //   'center'
          // );
        }








}






export class ExampleDataSource extends DataSource<Students> {
  filterChange = new BehaviorSubject('');
  dialog: unknown;

  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Students[] = [];
  renderedData: Students[] = [];
  constructor(
    public exampleDatabase: StudentsService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Students[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllStudentss();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((students: Students) => {
            const searchStr = (
              students.StudentId +
              students.firstName +
              students.email +
              students.mobile
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }
  disconnect() {
    // disconnect
  }
  /** Returns a sorted copy of the database data. */
  sortData(data: Students[]): Students[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.StudentId, b.StudentId];
          break;
        case 'firstName':
          [propertyA, propertyB] = [a.firstName, b.firstName];
          break;
        case 'email':
          [propertyA, propertyB] = [a.email, b.email];
          break;
        case 'date':
          [propertyA, propertyB] = [a.date, b.date];
          break;
        case 'time':
          [propertyA, propertyB] = [a.department, b.department];
          break;
        case 'mobile':
          [propertyA, propertyB] = [a.mobile, b.mobile];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }







}
