import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl,FormGroup } from '@angular/forms';
import {MAT_DATE_LOCALE} from '@angular/material/core';

export interface Role {
  id: string;
  name: string;
  creation_date: Date;
  type: string;
};

const types: string[] = [
  'Admin',
  'User',
];

const names: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})

export class RoleComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'creation_date', 'name', 'type'];
  dataSource: MatTableDataSource<Role>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  minDate: Date;
  maxDate: Date;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  searchData!: string;
  // Create 100 users
  users: Role[] = Array.from({ length: 100 }, (_, k) => this.createRandomData(k + 1));

  constructor() {
    this.dataSource = new MatTableDataSource(this.users);

    this.maxDate = new Date();
    this.minDate = this.minDateFinder();
  }

  ngAfterViewInit() {
    this.dataSource.filterPredicate = function (record,filter) {
      debugger;
      return record.id.indexOf(filter)!=-1 || record.name.toLocaleLowerCase().indexOf(filter)!=-1 || record.type.toLocaleLowerCase().indexOf(filter)!=-1 ;

   }
    this.setFilter();
  }

  setFilter() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  dateFilter() {
    this.searchData = "" ;
    const dateRangeData = this.users.filter(x => {
      const dateTime = x.creation_date.getTime();
      const startDate = this.range.value.start.getTime();
      const endDate = this.range.value.end.getTime();
      return startDate < dateTime && dateTime < endDate ;
    });
    this.dataSource = new MatTableDataSource(dateRangeData);
    this.setFilter();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  minDateFinder() {
    const minValue = Math.min(...this.users.map(data => data.creation_date.getTime()));
    return new Date(minValue) ;
  }

  ngOnInit(): void {
  }

  createRandomData(id: number): Role {
    const randomName =
      names[Math.round(Math.random() * (names.length - 1))] +
      ' ' +
      names[Math.round(Math.random() * (names.length - 1))].charAt(0) +
      '.';

    return {
      id: id.toString(),
      name: randomName,
      creation_date: this.randomDate(),
      type: types[Math.round(Math.random() * (types.length - 1))],
    };
  }
  randomDate() {
    const date = new Date().getDate() + 1;
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear() - 1;
    return new Date(Math.round((Math.random())) + year, Math.random() * month, Math.random() * date);
  }
}